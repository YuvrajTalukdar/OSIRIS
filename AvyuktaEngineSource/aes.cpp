#include "aes.h"

string encrypt_text(string data,string password)
{
    //key preparation
    CryptoPP::SHA256 hash;
    byte digest[CryptoPP::SHA256::DIGESTSIZE];
    hash.CalculateDigest(digest, (byte*)password.c_str(), password.length());

    CryptoPP::HexEncoder encoder;
    std::string sKey;
    encoder.Attach(new CryptoPP::StringSink(sKey));
    encoder.Put(digest, sizeof(digest));
    encoder.MessageEnd();

    byte key[CryptoPP::AES::MAX_KEYLENGTH]; //16 Bytes MAXKEYLENGTH 32 BYTES(SHA 256)
    byte  iv[CryptoPP::AES::BLOCKSIZE]; 

    memcpy(key, sKey.c_str(), CryptoPP::AES::MAX_KEYLENGTH);;
    memset(iv, 0x00, CryptoPP::AES::BLOCKSIZE);

    //data encryption

    string ciphertext;

    CryptoPP::AES::Encryption aesEncryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
    CryptoPP::CBC_Mode_ExternalCipher::Encryption cbcEncryption( aesEncryption, iv );

    CryptoPP::StreamTransformationFilter stfEncryptor(cbcEncryption, new CryptoPP::StringSink( ciphertext ) );
    stfEncryptor.Put( reinterpret_cast<const unsigned char*>( data.c_str() ), data.length() + 1 );
    stfEncryptor.MessageEnd();

    return ciphertext;
}

decrypted_data decrypt_text(string data,string password)
{
    decrypted_data obj;
    try
    {
        //key preparation
        CryptoPP::SHA256 hash;
        byte digest[CryptoPP::SHA256::DIGESTSIZE];
        hash.CalculateDigest(digest, (byte*)password.c_str(), password.length());

        CryptoPP::HexEncoder encoder;
        std::string sKey;
        encoder.Attach(new CryptoPP::StringSink(sKey));
        encoder.Put(digest, sizeof(digest));
        encoder.MessageEnd();

        byte key[CryptoPP::AES::MAX_KEYLENGTH]; //16 Bytes MAXKEYLENGTH 32 BYTES(SHA 256)
        byte  iv[CryptoPP::AES::BLOCKSIZE]; 

        memcpy(key, sKey.c_str(), CryptoPP::AES::MAX_KEYLENGTH);;
        memset(iv, 0x00, CryptoPP::AES::BLOCKSIZE);

        //data decryption
        
        CryptoPP::AES::Decryption aesDecryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
        CryptoPP::CBC_Mode_ExternalCipher::Decryption cbcDecryption( aesDecryption, iv );

        CryptoPP::StreamTransformationFilter stfDecryptor(cbcDecryption, new CryptoPP::StringSink(obj.decrypt_text));
        stfDecryptor.Put( reinterpret_cast<const unsigned char*>(data.c_str()),data.size() );
        stfDecryptor.MessageEnd();

        obj.decryption_successful=true;
    }
    catch(CryptoPP::Exception& ex)
    {
        obj.decryption_successful=false;
    }

    return obj;
}
