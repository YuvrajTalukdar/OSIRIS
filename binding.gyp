{
   "targets": [
      {
         "target_name": "AvyuktaEngine",
         "sources": ["AvyuktaEngineSource/jsmain.cpp",
                     "AvyuktaEngineSource/operations_class.cpp",
                     "AvyuktaEngineSource/database_class.cpp",
                     "AvyuktaEngineSource/filehandler_class.cpp"],
         "link_settings":{
            "libraries":['-std=c++17 -g -lpthread']
         }
      }
   ]
}
