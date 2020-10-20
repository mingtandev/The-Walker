using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class UIManager : MonoBehaviour
{
    // Start is called before the first frame update
    public static UIManager instance;
    bool canExecute;

    //REFERENCE 
    [HideInInspector] public Gun myGun; // refer to Current Gun
    [HideInInspector] public Player player;

    [Header("GUN UI")]
    public Text curAmmo;
    public Text totalAmmo;
    public Text gunName;
    public Text typeName;
    public Image reload;
    public GameObject activeGun1;
    public GameObject activeGun2;

    [Header("HEAL UI")]
    public Text heal;
    public Image fillHeal;

    void Awake()
    {

    }
    void Start()
    {

        StartCoroutine(LoadReference());
        MakeInstace();
    }

    // Update is called once per frame
    void Update()
    {
        if (canExecute)
        {
            GunInit();
            UpdateAmmo();
            UpdateHeal();
        }
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


    IEnumerator LoadReference()
    {
        yield return new WaitForSeconds(0.5f);
        myGun = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>().MyGun;
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();
        canExecute = true;
    }


    public void ActiveGun(int i)
    {
        reload.transform.gameObject.SetActive(false);

        if (i == 1)
        {
            activeGun1.gameObject.SetActive(true);
            activeGun2.gameObject.SetActive(false);
        }
        else
        {
            activeGun1.gameObject.SetActive(false);
            activeGun2.gameObject.SetActive(true);

        }
    }
}
