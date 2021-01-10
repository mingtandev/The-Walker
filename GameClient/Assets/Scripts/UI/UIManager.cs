using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
public class UIManager : MonoSingleton<UIManager>
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

    [Header("State game UI")]
    public Text Timestamp;
    [SerializeField] GameObject Panel_GameOver;
    [SerializeField] GameObject Panel_MissionComplete;
    [SerializeField] Text textCoin;
    [SerializeField] GameObject Objectives;
    [SerializeField] GameObject getAmmoNoti;
    public Text WalkerKill;
    public Text MalaiseKill;
    public Text BigboiKill;

    [Header("PAUSE MENU")]
    [SerializeField] GameObject Panel_Pause;
    public GameObject LoadingScene;






    void Start()
    {

        StartCoroutine(LoadReference());
        MakeInstace();
    }

    private void OnEnable()
    {
        GameManager.e_AddCoin += SetCoin;
        SetCoin(0);
    }

    private void OnDisable()
    {
        GameManager.e_AddCoin -= SetCoin;
    }

    // Update is called once per frame
    void Update()
    {
        if (canExecute)
        {
            GunInit();
            UpdateAmmo();
            UpdateHeal();


            if (Input.GetKeyDown(KeyCode.Tab)) ShowObjectives();
            else if (Input.GetKeyUp(KeyCode.Tab)) HideObjectives();

            //CHECK PAUSE
            PauseAction();
        }
    }




    void PauseAction()
    {
        if(Input.GetKeyDown(KeyCode.Escape))
        {
            Time.timeScale = 1 - Time.timeScale;
            TogglePauseMenu((int)Time.timeScale);
        }
    }

    void TogglePauseMenu(int toggle)
    {
        if(toggle==0)
        {
            Cursor.visible = true;
            Panel_Pause.SetActive(true);
        }
        else
        {
            Cursor.visible = false;
            Panel_Pause.SetActive(false);
        }
    }


    void ShowObjectives()
    {
        Objectives.SetActive(true);
    }

    void HideObjectives()
    {
        Objectives.SetActive(false);
    }

    public void ShowGetAmmo()
    {
        getAmmoNoti.SetActive(true);
    }

    public void HideGetAmmo()
    {
        getAmmoNoti.SetActive(false);
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


    public void GameOverShow()
    {
        Panel_GameOver.SetActive(true);
    }

    public void MissionCompleteShow()
    {
        Panel_MissionComplete.SetActive(true);
    }

    void SetCoin(int coin)
    {
        textCoin.text = coin.ToString();
    }


    public void GoHome()
    {
        SceneManager.LoadScene(0);
    }

    public void Restart()
    {
        Time.timeScale = 1f;
        TogglePauseMenu(1);
    }
}
