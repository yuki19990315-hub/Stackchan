idf_component_register(SRCS "main.c" INCLUDE_DIRS "." REQUIRES esp_driver_i2s)
if(SANNY_AUDIO_PINS_CONFIRMED)
  target_compile_definitions(${COMPONENT_LIB} PRIVATE SANNY_AUDIO_PINS_CONFIRMED=1)
endif()
