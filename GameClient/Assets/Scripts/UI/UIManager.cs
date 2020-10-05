using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class UIManager : MonoBehaviour
{
    // Start is called before the first frame update
    public static UIManager instance;

    //REFERENCE 
    [HideInInspector] public Gun myGun; // refer to Current Gun
    [HideInInspector] public Player player;

    //GUN UI
    public Text curAmmo;
    public Text totalAmmo;
    public Text gunName;
    public Text typeName;
    public Image reload;

    //HEAL
    public Text heal;
    public Image fillHeal;

    void Awake()
    {
        myGun = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>().MyGun;
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();

    }
    void Start()
    {
        GunInit();
        MakeInstace();
    }

    // Update is called once per frame
    void Update()
    {
        GunInit();
        UpdateAmmo();
        UpdateHeal();
    }




    void GunInit()
    {
        gunName.text = myGun.nameGun;
        typeName.text = myGun.type.ToString();
    }


    void UpdateAmmo()
    {
        curAmmo.text = myGun.curAmmo.ToString();
        totalAmmo.text = myGun.totalAmmo.ToString();
    }


    void UpdateHeal()
    {
        heal.text = player.Heal.ToString() + "%";
        fillHeal.fillAmount = (float)player.Heal / 100;
    }



    //This function will using at script GUN when reload(to update fill)
    public IEnumerator reloadUpdateFill(float time)
    {
        reload.transform.gameObject.SetActive(true);
        float animationTime = 0;
        while (animationTime <= time)
        {
            animationTime += Time.deltaTime;
            reload.fillAmount = animationTime / time;
            yield return null;
        }
    }

    void MakeInstace()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
