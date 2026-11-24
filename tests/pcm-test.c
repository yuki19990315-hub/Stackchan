#include <assert.h>
#include <limits.h>
#include "../diagnostics/audio/main/pcm.h"
int main(void){
  for(int i=INT16_MIN;i<=INT16_MAX;i++)assert(sanny_pcm16(sanny_slot32((int16_t)i))==i);
  assert(sanny_pcm16(INT32_MIN)==INT16_MIN);
  assert(sanny_pcm16(INT32_MAX)==INT16_MAX);
  assert(sanny_pcm16(-256)==-1);
  assert(sanny_pcm16(256)==0);
  return 0;
}
