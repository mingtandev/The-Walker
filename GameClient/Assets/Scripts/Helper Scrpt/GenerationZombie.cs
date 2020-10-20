using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GenerationZombie : MonoBehaviour
{
    public GameObject[] spawnPoint;
    private Player player;
    
    private void Awake() {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();

    }

    private void Start() {
        StartCoroutine(CheckDistance());
    }

    IEnumerator CheckDistance()
    {
        for(int i = 0 ; i < spawnPoint.Length ; i++)
        {
            if(Vector3.Distance(spawnPoint[i].transform.position,player.transform.position)<=50)
            {
                spawnPoint[i].SetActive(true);
            }
            else
            {
                spawnPoint[i].SetActive(false);

            }
        }

        yield return new WaitForSeconds(1f);
        StartCoroutine(CheckDistance());
    }


   
}
