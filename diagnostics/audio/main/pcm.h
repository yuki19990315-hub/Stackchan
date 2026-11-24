#pragma once
#include <stdint.h>
// INMP441 left-aligned 24-bit sample in a 32-bit I2S slot; reduce to signed PCM16.
// Divide instead of shifting signed negative values (implementation-defined).
static inline int16_t sanny_pcm16(int32_t slot){
  int64_t v=slot;
  return (int16_t)(v>=0?v/65536:-((-v+65535)/65536));
}
static inline int32_t sanny_slot32(int16_t pcm){return (int32_t)pcm*65536;}
