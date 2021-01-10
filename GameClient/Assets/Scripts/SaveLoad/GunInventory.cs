using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class GunInventory : MonoSingleton<GunInventory>
{

    [Header("Prefabs")]
    public GameObject[] gunInven;
    public GameObject[] listPosGunPrimary;
    public GameObject[] listPosGunSecondary;


    [Header("Setup Gun Position")]
    Vector3 newScale = new Vector3(200, 200, 200);
    Quaternion newQuat = Quaternion.Euler(0f, -90f, 0f);

    const string POS_P_GUN = "PosPrimaryGun";
    const string POS_S_GUN = "PosSecondaryGun";

    static int idx = 0;

    const string TAG_GUN = "Gun";

    public static string PRIMARY_GUN;
    public static string SECONDARY_GUN;


    void Start()
    {
        listPosGunPrimary = GameObject.FindGameObjectsWithTag(POS_P_GUN);
        listPosGunSecondary = GameObject.FindGameObjectsWithTag(POS_S_GUN);
    }

    private void OnEnable() {
        idx = 0;
    }
    public void SetupGunToInventory(string nameGun)
    {
        //PRIMARY
        for (int i = 0; i < gunInven.Length; i++)
        {
            if (gunInven[i].name.Equals(nameGun))
            {
                GameObject newgun_Primary = Instantiate(gunInven[i], listPosGunPrimary[idx].transform);
                GameObject newgun_Secondary = Instantiate(gunInven[i], listPosGunSecondary[idx].transform);

                newgun_Primary.transform.localScale = newScale;
                newgun_Secondary.transform.localScale = newScale;

                newgun_Primary.transform.localRotation = newQuat;
                newgun_Secondary.transform.localRotation = newQuat;

                newgun_Primary.transform.localPosition = new Vector3(20f, -20f, 0f);
                newgun_Secondary.transform.localPosition = new Vector3(20f, -20f, 0f);

                newgun_Primary.name = gunInven[i].name;
                newgun_Secondary.name = gunInven[i].name;

                //Set name
                listPosGunPrimary[idx].GetComponent<GunItem>().nameGun.text = newgun_Primary.name;
                listPosGunSecondary[idx].GetComponent<GunItem>().nameGun.text = newgun_Secondary.name;



                idx++;
            }
        }
    }


    public void ChooseGunPrimary(GameObject gameObject)
    {
        foreach (Transform t in gameObject.transform)
        {
            if (t.tag.Equals(TAG_GUN))
            {
                PRIMARY_GUN = t.name;
            }
        }
    }

    public void ChooseGunSecondaty(GameObject gameObject)
    {
        foreach (Transform t in gameObject.transform)
        {
            if (t.tag.Equals(TAG_GUN))
            {
                SECONDARY_GUN = t.name;
                Debug.Log(SECONDARY_GUN);
            }
        }
    }
}
