#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/i2s_std.h"
#include "esp_log.h"
#include "esp_heap_caps.h"
#include "pcm.h"
// Separate, opt-in board diagnostic. Never build into or flash the original firmware automatically.
#ifndef SANNY_AUDIO_PINS_CONFIRMED
#error Verify actual connector and speaker power before setting SANNY_AUDIO_PINS_CONFIRMED=1
#endif
static const char *TAG="sanny-audio";
static int32_t frames[256*2];
void app_main(void){
  i2s_chan_handle_t tx=NULL,rx=NULL;
  i2s_chan_config_t chan=I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0,I2S_ROLE_MASTER);
  ESP_ERROR_CHECK(i2s_new_channel(&chan,&tx,&rx));
  i2s_std_config_t cfg={
    .clk_cfg=I2S_STD_CLK_DEFAULT_CONFIG(16000),
    .slot_cfg=I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_32BIT,I2S_SLOT_MODE_STEREO),
    .gpio_cfg={.mclk=I2S_GPIO_UNUSED,.bclk=GPIO_NUM_15,.ws=GPIO_NUM_16,.dout=GPIO_NUM_18,.din=GPIO_NUM_17,.invert_flags={0}}
  };
  ESP_ERROR_CHECK(i2s_channel_init_std_mode(tx,&cfg));
  ESP_ERROR_CHECK(i2s_channel_init_std_mode(rx,&cfg));
  ESP_ERROR_CHECK(i2s_channel_enable(tx));
  ESP_ERROR_CHECK(i2s_channel_enable(rx));
  ESP_LOGI(TAG,"heap internal=%u psram=%u",(unsigned)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),(unsigned)heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
  // A low-volume 500Hz square tone, 128 ms total; no microphone playback.
  for(int j=0;j<8;j++){
    for(int i=0;i<256;i++){int16_t s=(i%32<16)?512:-512;frames[2*i]=frames[2*i+1]=sanny_slot32(s);}
    size_t n=0;ESP_ERROR_CHECK(i2s_channel_write(tx,frames,sizeof(frames),&n,1000));
    if(n!=sizeof(frames)){ESP_LOGE(TAG,"short TX");break;}
  }
  memset(frames,0,sizeof(frames));size_t sent=0;ESP_ERROR_CHECK(i2s_channel_write(tx,frames,sizeof(frames),&sent,1000));
  // Drain early recording frames; then read 2 seconds and log aggregate peaks only.
  for(int j=0;j<140;j++){
    size_t n=0;esp_err_t err=i2s_channel_read(rx,frames,sizeof(frames),&n,1000);
    if(err!=ESP_OK){ESP_LOGE(TAG,"RX error %s",esp_err_to_name(err));break;}
    if(j<15)continue;
    int peak=0;for(size_t i=0;i+1<n/sizeof(int32_t);i+=2){int p=abs((int)sanny_pcm16(frames[i]));if(p>peak)peak=p;}
    if(j%10==0)ESP_LOGI(TAG,"left channel peak=%d bytes=%u",peak,(unsigned)n);
  }
  ESP_ERROR_CHECK(i2s_channel_disable(rx));ESP_ERROR_CHECK(i2s_channel_disable(tx));
  ESP_ERROR_CHECK(i2s_del_channel(rx));ESP_ERROR_CHECK(i2s_del_channel(tx));
  ESP_LOGI(TAG,"finished; no recordings saved or transmitted");
}
