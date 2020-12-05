using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

namespace Michsky.UI.FieldCompleteMainMenu
{
    public class LoginUserManager : MonoBehaviour
    {
        [Header("RESOURCES")]
        public SwitchToMainPanels switchPanelMain;
        public UIElementSound soundScript;
        public Animator wrongAnimator;
        public Text usernameText;
        public Text passwordText;


        readonly string postURL = "http://r2w-team-api-v2.ap-1.evennode.com/users/login";
        readonly string itemURL = "http://r2w-team-api-v2.ap-1.evennode.com/user-items/";

        string emailTest = "ccc@kascsjdhaasdsdf.asc";
        string passwordTest = "12345";
        void Start()
        {


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
                    wrongAnimator.Play("Notification In");
                    soundScript.Notification();
                    yield break;
                }

                GameManager.token = JsonConvert.DeserializeObject<Token>(www.downloadHandler.text);

                if (GameManager.token.msg == "success")
                {
                    switchPanelMain.Animate();
                    GameManager.playerData = JsonConvert.DeserializeObject<PlayerData>(Decode(GameManager.token.token));
                    StartCoroutine(GetItemData(GameManager.playerData._id));

                }
                else
                {
                    wrongAnimator.Play("Notification In");
                    soundScript.Notification();
                }

            }
        }


        public void Login()
        {

            StartCoroutine(PostRequest(usernameText.text, passwordText.text));
        }

        IEnumerator GetItemData(string id)
        {
            UnityWebRequest www = UnityWebRequest.Get(itemURL + id);
            yield return www.SendWebRequest();
            Debug.Log(www.downloadHandler.text);
            GameManager.UserItems = JsonConvert.DeserializeObject<ListItem>(www.downloadHandler.text);
            Debug.Log(GameManager.UserItems);
            // foreach(Weapon we in GameManager.UserItems.userItem.items.weapons)
            // {
            //     Debug.Log(we.name);
            // }
        }
    }
}