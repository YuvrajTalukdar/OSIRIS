cmd_Release/obj.target/AvyuktaEngine.node := g++ -o Release/obj.target/AvyuktaEngine.node -shared -pthread -rdynamic -m64  -Wl,-soname=AvyuktaEngine.node -Wl,--start-group Release/obj.target/AvyuktaEngine/AvyuktaEngineSource/jsmain.o Release/obj.target/AvyuktaEngine/AvyuktaEngineSource/operations_class.o Release/obj.target/AvyuktaEngine/AvyuktaEngineSource/database_class.o Release/obj.target/AvyuktaEngine/AvyuktaEngineSource/filehandler_class.o -Wl,--end-group -std=c++17 -g -lpthread