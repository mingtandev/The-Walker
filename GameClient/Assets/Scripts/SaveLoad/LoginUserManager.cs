using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using System;
using UnityEngine.SceneManagement;
using System.Text;

namespace Michsky.UI.FieldCompleteMainMenu
{
    public class LoginUserManager : MonoSingleton<LoginUserManager>
    {
        [Header("RESOURCES")]
        public SwitchToMainPanels switchPanelMain;
        public UIElementSound soundScript;
        public Animator wrongAnimator;
        public InputField usernameText;
        public InputField passwordText;
        public GameObject LoadingScene;

        //https://the-walker-api.nguyen-quoc-thai.vercel.app/


        static bool isLogin;
        static bool loadDemo;

        [SerializeField] Text name;
        [SerializeField] Text nameProfile;


        private void OnEnable()
        {
            if (isLogin)
            {
                switchPanelMain.Animate();
                StartCoroutine(GetItemData(GameManager.playerData._id));
                SetUI();

            }
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;

        }

        string Decode(string token)
        {
            //Sau khi thái sửa API , nó đã tự chuyển thành base64 , nơi mà + và / đc sửa thành - và _ , nên phải sửa lại
            string converted = token.Replace('-', '+');
            converted = converted.Replace('_', '/');

            var parts = converted.Split('.');
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

            UnityWebRequest www = UnityWebRequest.Post(GameManager.postURL, form);
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log("Error While Sending: " + www.error);
            }
            else
            {
                Debug.LogError(www.downloadHandler.text);
                if (www.downloadHandler.text.Contains("errors"))
                {
                    Debug.Log("Login error");
                    wrongAnimator.Play("Notification In");
                    soundScript.Notification();
                    yield break;
                }

                GameManager.token = JsonConvert.DeserializeObject<Token>(www.downloadHandler.text);
                Debug.LogError(GameManager.token);
                if (GameManager.token.msg == "success")
                {
                    switchPanelMain.Animate();

                    GameManager.playerData = JsonConvert.DeserializeObject<PlayerData>(Decode(GameManager.token.token));
                    StartCoroutine(GetItemData(GameManager.playerData._id));
                    SetUI();
                    isLogin = true;

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
            UnityWebRequest www = UnityWebRequest.Get(GameManager.itemURL + id);
            www.SetRequestHeader("Authorization", "Bearer " + GameManager.token.token);
            yield return www.SendWebRequest();

            GameManager.RootUser = JsonConvert.DeserializeObject<RootUser>(www.downloadHandler.text);

            foreach (Guns gun in GameManager.RootUser.user.items.guns)
            {
                GunInventory.Instance.SetupGunToInventory(gun.name);
            }


            foreach (Outfit outfit in GameManager.RootUser.user.items.outfits)
            {
                OutfitInventory.Instance.SetupOutfitToInventory(outfit.name);
            }
        }



        public void StartGame()
        {
            if (!loadDemo)
            {
                StartCoroutine(GameManager.Instance.LoadAsyncChronous(2, LoadingScene));
                loadDemo = true;

            }
            else
            {
                StartCoroutine(GameManager.Instance.LoadAsyncChronous(1, LoadingScene));
            }
        }

        

        void SetUI()
        {
            name.text = GameManager.playerData.name.ToString();
            nameProfile.text = GameManager.playerData.name.ToString();
        }

        public void OpenURL(string URL)
        {
            Application.OpenURL(URL);
        }

    }
}