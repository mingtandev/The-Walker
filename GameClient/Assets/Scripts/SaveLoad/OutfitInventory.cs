using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OutfitInventory : MonoSingleton<OutfitInventory>
{
    // Start is called before the first frame update
    [Header("Prefabs")]
    public GameObject[] OutfirsIven;
    public GameObject[] listPosOutfit;

    const string POS_OUTFIT = "Pos outfit";
    int idx = 0;

    [Header("Setup Gun Position")]
    Vector3 newScale = new Vector3(100, 100, 135);
    Vector3 position = new Vector3(0f, -100f, -1500f);

    public static string MainOutfit;

    const string TAG_OUTFIT = "Outfit";

    private new void Awake()
    {
        listPosOutfit = GameObject.FindGameObjectsWithTag(POS_OUTFIT);

    }

    private void OnEnable() {
        idx = 0;
    }

    public void SetupOutfitToInventory(string outfitName)
    {
        //PRIMARY
        for (int i = 0; i < OutfirsIven.Length; i++)
        {
            if (OutfirsIven[i].name.Equals(outfitName))
            {
                GameObject newOutfit = Instantiate(OutfirsIven[i], listPosOutfit[idx].transform);

                newOutfit.transform.localScale = newScale;

                newOutfit.GetComponent<RectTransform>().localPosition = position;

                newOutfit.name = OutfirsIven[i].name;

                //Set name
                listPosOutfit[idx].GetComponent<OutfitItem>().nameOutfit.text = newOutfit.name;



                idx++;
            }
        }
    }


    public void ChooseOutfit(Transform transform)
    {

        foreach (Transform t in transform)
        {
            if (t.tag.Equals(TAG_OUTFIT))
            {
                MainOutfit = t.name;
            }
        }


    }
}
