{
   "targets": [
      {
         "target_name": "AvyuktaEngine",
         "sources": ["AvyuktaEngineSource/jsmain.cpp",
                     "AvyuktaEngineSource/operations_class.cpp",
                     "AvyuktaEngineSource/aes.cpp",
                     "AvyuktaEngineSource/database_class.cpp",
                     "AvyuktaEngineSource/filehandler_class.cpp"],  
         'cflags_cc': ['-O2'],
         "libraries": ["..\cryptopp\\x64\Output\Release\cryptlib"],
         'msvs_settings': 
         {
            'VCCLCompilerTool': { "ExceptionHandling": 1, 'AdditionalOptions': [ '-std:c++17' ]},
         },
         "conditions": [
            ["OS=='win'", {
               "defines": [
                  "_HAS_EXCEPTIONS=1"
               ]
            }]
         ]
      },
   ]
}
