using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class GameManager : MonoSingleton<GameManager>
{
    public static Token token;
    public static PlayerData playerData;
    public static RootUser RootUser;
    public float TimeLeft = 60f;
    //readonly string itemURL = "http://r2w-team-api-v2.ap-1.evennode.com/users/";
    public static readonly string postURL = "https://nguyen-quoc-thai-2-the-walker-api-v2.zeet.app/users/login";
    public static readonly string itemURL = "https://nguyen-quoc-thai-2-the-walker-api-v2.zeet.app/users/";

    public int _walkersKill;
    public int WalkerKill
    {
        get => _walkersKill;
        set
        {
            _walkersKill = value;
            UIManager.Instance.WalkerKill.text = "Kill " + value.ToString() + "/50 Walker";
        }
    }
    private int _coin;
    public int Coin
    {
        get => _coin;
        set
        {
            _coin = value;
            e_AddCoin?.Invoke(_coin);
        }
    }
    public static Action<int> e_AddCoin;

    public void GameOver()
    {
        UIManager.Instance.GameOverShow();
        Time.timeScale = 0f;
    }

    public void MissionComplete()
    {

    }

    IEnumerator SetCrash(int coin)
    {

        string ourPostData = "{\"coin\" : \"" + coin.ToString() + "\"}";


        UnityWebRequest www = UnityWebRequest.Put(itemURL + GameManager.playerData._id, ourPostData);
        www.method = "PATCH";


        www.SetRequestHeader("Authorization", "Bearer " + GameManager.token.token);
        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("Accept", "application / json");
        yield return www.SendWebRequest();

    }

    public void SetCoin(int coin)
    {
        StartCoroutine(SetCrash(coin));
    }


    public IEnumerator LoadAsyncChronous(int indexScene, GameObject panel)
    {
        AsyncOperation operation = SceneManager.LoadSceneAsync(indexScene);
        panel.SetActive(true);

        while (!operation.isDone)
        {
            float progess = Mathf.Clamp01(operation.progress / .9f);
            yield return null;
        }

        panel.SetActive(false);
    }

}
