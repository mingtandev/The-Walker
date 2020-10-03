using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HideBuilding : MonoBehaviour
{
    // Start is called before the first frame update
    MyPlayerController player;

    List<GameObject> listBuilding;
    public enum SurfaceType
    {
        Opaque,
        Transparent
    }

    public enum BlendMode
    {
        Alpha,
        Premultiply,
        Additive,
        Multiply
    }


    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>();
        listBuilding = new List<GameObject>();
    }

    void Start()
    {

    }
    // Update is called once per frame
    void Update()
    {
        HideTheBuilding();
        
    }


    void HideTheBuilding()
    {
        RaycastHit[] hits;

        Vector3 playerPosScreen = Camera.main.WorldToScreenPoint(player.transform.position);
        Ray camRay = Camera.main.ScreenPointToRay(playerPosScreen);
        hits = Physics.RaycastAll(transform.position, camRay.direction, 50f, LayerMask.GetMask("BuildingLayer"));
        if (hits.Length != 0)
        {
            for (int i = 0; i < hits.Length; i++)
            {
                ChangeTransparent(hits[i]);
            }
        }
        ResetBuilding(hits); // if hits change

    }


    void ChangeTransparent(RaycastHit hit)
    {
        MeshRenderer myRend = hit.transform.GetComponent<MeshRenderer>();
        Material[] materials = myRend.materials;
        materials[0].SetFloat("_Surface", (float)SurfaceType.Transparent);
        materials[0].SetColor("_BaseColor", new Color(1, 1, 1, 0.3f));
        myRend.materials = materials;
        SetupMaterialBlendMode(materials[0]);
        AddToListBuilding(hit);
    }

    void ResetTransparent(GameObject hit)
    {
        MeshRenderer myRend = hit.GetComponent<MeshRenderer>();
        Material[] materials = myRend.materials;
        materials[0].SetFloat("_Surface", (float)SurfaceType.Opaque);
        materials[0].SetColor("_BaseColor", new Color(1, 1, 1, 1f));
        myRend.materials = materials;
        SetupMaterialBlendMode(materials[0]);
    }

    void AddToListBuilding(RaycastHit hit)
    {
        if (!listBuilding.Contains(hit.transform.gameObject))
        {
            listBuilding.Add(hit.transform.gameObject);
        }
    }

    void ResetBuilding(RaycastHit[] hits)
    {
        for (int i = 0; i < listBuilding.Count; i++)
        {
            for (int j = 0; j < hits.Length; j++)
            {
                if (listBuilding[i].Equals(hits[j].transform.gameObject))
                {
                    break;
                }
                else if (j == hits.Length - 1)
                {
                    //this hit'll reset
                    ResetTransparent(listBuilding[i]);
                    listBuilding.Remove(listBuilding[i]);
                }
            }
            if(hits.Length==0)
            {
                ResetTransparent(listBuilding[i]);
                listBuilding.Remove(listBuilding[i]);
            }

        }
    }



    //Script support change material runtime
    void SetupMaterialBlendMode(Material material)
    {

        bool alphaClip = material.GetFloat("_AlphaClip") == 1;
        if (alphaClip)
            material.EnableKeyword("_ALPHATEST_ON");
        else
            material.DisableKeyword("_ALPHATEST_ON");
        SurfaceType surfaceType = (SurfaceType)material.GetFloat("_Surface");
        if (surfaceType == 0)
        {
            material.SetOverrideTag("RenderType", "");
            material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
            material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.Zero);
            material.SetInt("_ZWrite", 1);
            material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
            material.renderQueue = -1;
            material.SetShaderPassEnabled("ShadowCaster", true);
        }
        else
        {
            BlendMode blendMode = (BlendMode)material.GetFloat("_Blend");
            switch (blendMode)
            {
                case BlendMode.Alpha:
                    material.SetOverrideTag("RenderType", "Transparent");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                    material.SetInt("_ZWrite", 0);
                    material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
                    material.SetShaderPassEnabled("ShadowCaster", false);
                    break;
                case BlendMode.Premultiply:
                    material.SetOverrideTag("RenderType", "Transparent");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                    material.SetInt("_ZWrite", 0);
                    material.EnableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
                    material.SetShaderPassEnabled("ShadowCaster", false);
                    break;
                case BlendMode.Additive:
                    material.SetOverrideTag("RenderType", "Transparent");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.One);
                    material.SetInt("_ZWrite", 0);
                    material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
                    material.SetShaderPassEnabled("ShadowCaster", false);
                    break;
                case BlendMode.Multiply:
                    material.SetOverrideTag("RenderType", "Transparent");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.DstColor);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.Zero);
                    material.SetInt("_ZWrite", 0);
                    material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
                    material.SetShaderPassEnabled("ShadowCaster", false);
                    break;
            }
        }

    }
}

