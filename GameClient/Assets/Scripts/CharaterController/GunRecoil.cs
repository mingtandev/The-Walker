using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GunRecoil : MonoBehaviour
{
    // Start is called before the first frame update
    public float verticleRecoil;
    public float horizontalRecoil;
    public float duration;
    int index;
    float time;
    public Vector2[] recoils;
    CharaterAimming playerCamera;
    public void GenerateRecoil()
    {
        horizontalRecoil = recoils[index].x;
        verticleRecoil = recoils[index].y;
        time = duration;
    }

    private void Awake()
    {
        playerCamera = GameObject.FindGameObjectWithTag("Player").GetComponent<CharaterAimming>();
    }
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        if (time > 0)
        {

            playerCamera.YAxis.Value -= verticleRecoil * 50 * Time.deltaTime;
            playerCamera.XAxis.Value -= horizontalRecoil * 50 * Time.deltaTime;
            time -= Time.deltaTime;
            index = nextRecoil();
        }
    }

    public void ResetIndex()
    {
        index = 0;
        time = -1;
        playerCamera.YAxis.Value += verticleRecoil * Time.deltaTime;
        playerCamera.XAxis.Value += horizontalRecoil * Time.deltaTime;
    }

    int nextRecoil()
    {
        return (index + 1) % recoils.Length;
    }
}
