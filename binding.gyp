{
   "targets": [
      {
        "target_name": "AvyuktaEngine",
        "sources": ["AvyuktaEngineSource/jsmain.cpp",
                    "AvyuktaEngineSource/operations_class.cpp",
                    "AvyuktaEngineSource/aes.cpp",
                    "AvyuktaEngineSource/database_class.cpp",
                    "AvyuktaEngineSource/filehandler_class.cpp"],
         
        'cflags_cc': [ '-frtti','-fexceptions'],
        "libraries": ["-lcryptopp"]
      }
   ]
}
