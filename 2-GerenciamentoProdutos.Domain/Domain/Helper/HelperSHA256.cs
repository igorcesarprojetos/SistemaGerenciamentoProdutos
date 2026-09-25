using System.Security.Cryptography;
using System.Text;

namespace GerenciamentoProdutos.Domain.Helper
{
    public static class HelperSHA256
    {

        public static string Encrypt(string source)
        {
            // Convert the input string to a byte array and compute the hash.
            using (SHA256 sha256Hash = SHA256.Create())
            {
                string hash = GetSHA256Hash(sha256Hash, source);
                return hash;
            }
            
        }
        static string GetSHA256Hash(SHA256 sha256Hash, string input)
        {
            // Convert the input string to a byte array and compute the hash.
            byte[] data = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }
    }
}
