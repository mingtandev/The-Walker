using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Token
{

    public string msg { get; set; }
    public string token { get; set; }
    public string refreshToken { get; set; }
}

public class PlayerData
{
    public string _id { get; set; }
    public string roles { get; set; }
    public string name { get; set; }
    public int cash { get; set; }
    public string slugName { get; set; }
    public string email { get; set; }
    public int iat { get; set; }
    public int exp { get; set; }

    public void ShowInfo()
    {
        Debug.LogFormat("ID : {0} \n  roles : {1} \n  name : {2} \n  cash : {3} \n  slugName : {4} \n email : {5} \n  iat : {6} \n exp : {7} \n" , _id , roles , name , cash.ToString() , slugName , email , iat.ToString() , exp.ToString());
    }
}
