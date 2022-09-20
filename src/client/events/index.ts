import axios from "axios";
import { dialog, ipcMain } from "electron";
import { Global } from "../global";

ipcMain.handle('test1', async (e) => {
    // axios.defaults.withCredentials = true;
    // let value = await axios.get('https://www.erp321.com');
    // // return 'hello world!';
    // console.log(value.data);


    let reqInstance = axios.create({
        headers: {
            // cookie : '_ati=2439270553192; u_name=1843608652; u_lid=18436086529; j_d_3=2XZG3ZGMSNOHONJE25RAMKQQKTLFIFP6NCDS2CFCUS32NJTCZKPYVB2YUIIOVQ4NRJ4I2HBT7CN5JCZLGQ575YTPVY; u_json=%7B%22t%22:%222022-9-21+00:46:42%22,%22co_type%22:%22%E6%A0%87%E5%87%86%E5%95%86%E5%AE%B6%22,%22proxy%22:null,%22ug_id%22:%22%22,%22dbc%22:%221212%22,%22tt%22:%2232%22,%22apps%22:%221.4.152.169%22,%22pwd_valid%22:%221%22,%22ssi%22:null,%22sign%22:%223402010.025F53438FFA4640932D134E5045F16A,818309d2ce2576528d63b96f2db2b420%22%7D; u_ssi=; u_co_name=%E9%83%91%E5%B7%9E%E9%9A%86%E7%9D%BF%E5%9B%BE%E4%B9%A6%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8; u_drp=; v_d_144=1663692377143_dee957de4ae14a79e469088e2e1837a8; u_cid=133081660022569815; u_r=12,13,14,15,17,18,22,23,27,28,29,30,31,32,33,34,35,36,40,41; u_sso_token=CS@f464231938bf40cab7ab58ce46b497f4; u_id=15278773; u_shop=11975877,12895255,12876630,12891205; u_co_id=10299394; p_50=B26ED80CDB34E784EB4AE9CDC55D45B4637993180022577839%7C10299394; u_env=www; SessionCode=499603b0-04e0-ffa1-45731835bcb7358; 3AB9D23F7A4B3C9B=2XZG3ZGMSNOHONJE25RAMKQQKTLFIFP6NCDS2CFCUS32NJTCZKPYVB2YUIIOVQ4NRJ4I2HBT7CN5JCZLGQ575YTPVY; acw_tc=2760826616636942365466617e6fc6ce25a9559382d62944c88eaf06decd43'
            cookie: Global.cookie
        }
    })
    let value = await reqInstance.get('https://www.erp321.com');

  
    return value.data;
})