#include "aes.h"

std::string encrypt_text(std::string data,std::string password)
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
    std::string ciphertext;
    CryptoPP::AES::Encryption aesEncryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
    CryptoPP::CBC_Mode_ExternalCipher::Encryption cbcEncryption( aesEncryption, iv );

    CryptoPP::StreamTransformationFilter stfEncryptor(cbcEncryption, new CryptoPP::StringSink( ciphertext ) );
    stfEncryptor.Put( reinterpret_cast<const unsigned char*>( data.c_str() ), data.length() + 1 );
    stfEncryptor.MessageEnd();

    //cipher text encoder
    std::string hex_encoded_ciphertext;
    CryptoPP::StringSource ss((byte*)ciphertext.c_str(),ciphertext.size(),true,
        new CryptoPP::HexEncoder(new CryptoPP::StringSink(hex_encoded_ciphertext)) 
    );

    return hex_encoded_ciphertext;
}

decrypted_data decrypt_text(std::string data,std::string password)
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

        //cipher text decoder
        std::string decodedData;
        CryptoPP::HexDecoder decoder;
        decoder.Attach( new CryptoPP::StringSink( decodedData ) );
        decoder.Put( (byte*)data.data(), data.size() );
        decoder.MessageEnd();
        
        //data decryption
        CryptoPP::AES::Decryption aesDecryption(key, CryptoPP::AES::DEFAULT_KEYLENGTH);
        CryptoPP::CBC_Mode_ExternalCipher::Decryption cbcDecryption( aesDecryption, iv );

        CryptoPP::StreamTransformationFilter stfDecryptor(cbcDecryption, new CryptoPP::StringSink(obj.decrypted_text));
        stfDecryptor.Put( reinterpret_cast<const unsigned char*>(decodedData.c_str()),decodedData.size() );
        stfDecryptor.MessageEnd();

        obj.decryption_successful=true;
    }
    catch(CryptoPP::Exception& ex)
    {
        obj.decryption_successful=false;
        std::cout<<"\n\nDecryption Error:- "<<ex.what();
    }

    return obj;
}
