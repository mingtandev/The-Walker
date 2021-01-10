using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class TimeStamp : MonoBehaviour
{
    // Start is called before the first frame update
    public 
    float _1min = 60f;
    float curSec = 59f;


    private void Start()
    {
        StartCoroutine(countTing());
    }

    IEnumerator countTing()
    {
        UIManager.Instance.Timestamp.text = GameManager.Instance.TimeLeft + ":" + curSec;
        yield return new WaitForSeconds(1f);
        curSec--;
        if(curSec==0)
        {
            GameManager.Instance.TimeLeft--;
            curSec = 60f;
        }
        if(GameManager.Instance.TimeLeft==0)
        {
            GameManager.Instance.GameOver();
        }
        StartCoroutine(countTing());
    }
}
