#declare the variabler
CC=g++
LIBS= -lpthread -lcryptopp
# use -Wall for displaying all warnings
RELEASEFLAGS= -std=c++17 -march=native -mtune=native -O2
DEBUGFLAGS= -std=c++17 -g
#debug
debug: cppmain_d.o operation_class_d.o aes_d.o database_class_d.o filehandler_class_d.o
	$(CC) -o a.out cppmain_d.o operation_class_d.o aes_d.o database_class_d.o filehandler_class_d.o $(LIBS) $(DEBUGFLAGS)

cppmain_d.o: cppmain.cpp 
	$(CC) $(DEBUGFLAGS) $(LIBS) -c cppmain.cpp -o cppmain_d.o

operation_class_d.o: operations_class.cpp
	$(CC) $(DEBUGFLAGS) $(LIBS) -c operations_class.cpp -o operation_class_d.o

aes_d.o: aes.cpp
	$(CC) $(DEBUGFLAGS) $(LIBS) -c aes.cpp -o aes_d.o

database_class_d.o: database_class.cpp
	$(CC) $(DEBUGFLAGS) $(LIBS) -c database_class.cpp -o database_class_d.o

filehandler_class_d.o: filehandler_class.cpp
	$(CC) $(DEBUGFLAGS) $(LIBS) -c filehandler_class.cpp -o filehandler_class_d.o

#release
release: cppmain_r.o operation_class_r.o aes_r.o database_class_r.o filehandler_class_r.o
	$(CC) -o a.out cppmain_r.o operation_class_r.o aes_r.o database_class_r.o filehandler_class_r.o $(LIBS) $(RELEASEFLAGS)

cppmain_r.o: cppmain.cpp 
	$(CC) $(RELEASEFLAGS) $(LIBS) -c cppmain.cpp -o cppmain_r.o

cppmain_r.o: cppmain.cpp 
	$(CC) $(RELEASEFLAGS) $(LIBS) -c cppmain.cpp -o cppmain_r.o

operation_class_r.o: operations_class.cpp
	$(CC) $(RELEASEFLAGS) $(LIBS) -c operations_class.cpp -o operation_class_r.o

aes_r.o: aes.cpp
	$(CC) $(RELEASEFLAGS) $(LIBS) -c aes.cpp -o aes_r.o

database_class_r.o: database_class.cpp
	$(CC) $(RELEASEFLAGS) $(LIBS) -c database_class.cpp -o database_class_r.o

filehandler_class_r.o: filehandler_class.cpp
	$(CC) $(RELEASEFLAGS) $(LIBS) -c filehandler_class.cpp -o filehandler_class_r.o

#cleans all files which ends with o and out
clean:
	rm -rf *o a.out