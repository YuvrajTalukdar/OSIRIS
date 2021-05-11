#include <iostream>
#include <iomanip>

#include<cryptopp/modes.h>
#include<cryptopp/aes.h>
#include<cryptopp/filters.h>
#include<cryptopp/sha.h>
#include<cryptopp/hex.h>

#include<string.h>

using namespace std;

struct decrypted_data
{
    string decrypt_text;
    bool decryption_successful;
};

string encrypt_text(string data,string password);

decrypted_data decrypt_text(string data,string password);