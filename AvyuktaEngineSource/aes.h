#include <iostream>
#include <iomanip>

#include"..//cryptopp/modes.h"
#include"..//cryptopp/aes.h"
#include"..//cryptopp/filters.h"
#include"..//cryptopp/sha.h"
#include"..//cryptopp/hex.h"

#include<string.h>

using namespace CryptoPP;

struct decrypted_data
{
    std::string decrypted_text;
    bool decryption_successful=false;
};

std::string encrypt_text(std::string data,std::string password);

decrypted_data decrypt_text(std::string data,std::string password);