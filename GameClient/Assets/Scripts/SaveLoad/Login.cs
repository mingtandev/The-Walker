using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
//using System.IdentityModel.Tokens;

public class Login : MonoBehaviour
{
    readonly string postURL = "http://r2w-team-api.ap-1.evennode.com/users/login";

    string emailTest = "ccc@kascsjdhaasdsdf.asc";
    string passwordTest = "12345";
    void Start()
    {
        StartCoroutine(PostRequest(emailTest, passwordTest));

    }


    string Decode(string token)
    {
        var parts = token.Split('.');
        if (parts.Length > 2)
        {
            var decode = parts[1];
            var padLength = 4 - decode.Length % 4;
            if (padLength < 4)
            {
                decode += new string('=', padLength);
            }
            var bytes = System.Convert.FromBase64String(decode);
            var userInfo = System.Text.ASCIIEncoding.ASCII.GetString(bytes);
            return userInfo;
        }
        return null;
    }




    IEnumerator PostRequest(string email, string password)
    {


        WWWForm form = new WWWForm();
        form.AddField("email", email);
        form.AddField("password", password);

        UnityWebRequest www = UnityWebRequest.Post(postURL, form);
        yield return www.SendWebRequest();

        if (www.isNetworkError)
        {
            Debug.Log("Error While Sending: " + www.error);
        }
        else
        {

            if (www.downloadHandler.text.Contains("errors"))
            {
                Debug.Log("Login error");
                yield break;
            }

            LoginSceneManager.token = JsonConvert.DeserializeObject<Token>(www.downloadHandler.text);

            Debug.Log(LoginSceneManager.token.msg);

            LoginSceneManager.playerData = JsonConvert.DeserializeObject<PlayerData>(Decode(LoginSceneManager.token.token));

            LoginSceneManager.playerData.ShowInfo();

        }
    }
}
