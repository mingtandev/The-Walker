using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public struct OwnGun 
{
     public GameObject gun;
     public bool isOwn;
}

[System.Serializable]
public struct OwnHat
{
    public GameObject hat;
    public bool isOwn;
}

[System.Serializable]
public struct OwnOutfit
{
    public GameObject outfit;
    public bool isOwn;
}





public class SaveLoadManager : MonoBehaviour
{
    // Start is called before the first frame update
    public static SaveLoadManager instance; 
    public OwnGun[] InventoryGun;
    public static OwnGun[] chooseGun = new OwnGun[2];


    [Header("Hats")]
    public OwnHat[] Hats;


    [Header("Outfits")]
    public OwnOutfit[] Outfits;


    private void Awake() {
        MakeSingleton();
        LoadGun();
        //LoadSkin();
    }

    void Start()
    {


    }

    void Update()
    {
        
    }


    void LoadGun()
    {
        int length = 0 ;
        for(int i = 0 ;  i<InventoryGun.Length ; i++)
        {
            if(InventoryGun[i].isOwn)
                {
                    chooseGun[length] = InventoryGun[i];
                    InventoryGun[i].gun.SetActive(true);
                    length++;
                    if(length==2)
                    {
                        return;
                    }
                }
        }
    }

    void MakeSingleton()
    {
        if(instance==null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }
    // void LoadSkin()
    // {
    //     for(int i = 0 ;  i<Hats.Length ; i++)
    //     {
    //         if(Hats[i].isOwn)
    //         {
    //             Hats[i].hat.SetActive(true);
    //             break;
    //         }
    //     }


    //     for(int i = 0 ;  i<Outfits.Length ; i++)
    //     {
    //         if(Outfits[i].isOwn)
    //         {
    //             Outfits[i].outfit.SetActive(true);
    //             break;
    //         }
    //     }

        
    // }
}
