using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TempLoadeScene : MonoBehaviour
{
    public GameObject LoadingPage;
    private void OnEnable() {
        StartCoroutine(GameManager.Instance.LoadAsyncChronous(1,LoadingPage));
    }
}
