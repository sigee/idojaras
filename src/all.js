var idojaras_regio = idojaras_get_config('pref-idojaras-regio');
var idojaras_http_request = false;

function idojaras_change_config(idojaras_variable, idojaras_value) {
    var temp = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    var branch = temp.getBranch("extensions.idojaras.");
    branch.setCharPref(idojaras_variable, idojaras_value);
    idojaras_init()
}

function idojaras_change_config2(idojaras_variable){
    alert(idojaras_variable)
}

function idojaras_get_config(idojaras_variable) {
    var temp = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    var branch = temp.getBranch("extensions.idojaras.");
    return branch.getCharPref(idojaras_variable)
}

function idojaras_save_config() {
    var temp = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    var branch = temp.getBranch("extensions.idojaras.");
    branch.setCharPref('pref-idojaras-regio', idojaras_regio)
}

function idojaras_init() {
    idojaras_regio = idojaras_get_config('pref-idojaras-regio');
    idojaras_rss_keres()
}

function idojaras_rss_keres() {
    idojaras_http_request = new XMLHttpRequest();
    if (idojaras_http_request.overrideMimeType) {
        idojaras_http_request.overrideMimeType('text/xml')
    }
    if (!idojaras_http_request) {
        alert('Hiba! Nem lehet létrehozni a kapcsolatot a lekérdezéshez!');
        return false
    }
    idojaras_http_request.onreadystatechange = idojaras_rss_info;
    idojaras_http_request.open('GET', 'http://koponyeg.hu/idojaras_rss.php?regios=' + idojaras_regio, true);
    idojaras_http_request.send(null)
}

function idojaras_rss_info() {
    if (idojaras_http_request.readyState == 4) {
        if (idojaras_http_request.status == 200) {
            var xmlobject = idojaras_http_request.responseXML;
            var root = xmlobject.getElementsByTagName('rss')[0];
            var channel = root.getElementsByTagName('channel')[0];
            var mertekegysegek = channel.getElementsByTagName('koponyeg:mertekegysegek')[0];
            var homerseklet = mertekegysegek.getAttribute('homerseklet');
            var sebesseg = mertekegysegek.getAttribute('sebesseg');
            var csapadek = mertekegysegek.getAttribute('csapadek');
            var regio = channel.getElementsByTagName('koponyeg:elhelyezkedes')[0].getAttribute('regio');
            var varos = channel.getElementsByTagName('koponyeg:elhelyezkedes')[0].getAttribute('varos');
            var jelenido = channel.getElementsByTagName('item')[0].getElementsByTagName('koponyeg:jelenido')[0];
            var jelenido_homerseklet = jelenido.getAttribute('homerseklet');
            var jelenido_idokep = jelenido.getAttribute('idokep');
            var jelenido_szelirany = jelenido.getAttribute('szelirany');
            var jelenido_szelsebesseg = jelenido.getAttribute('szelsebesseg');
            var jelenido_szelszoveges = jelenido.getAttribute('szelszoveges');
            var jelenido_szelirany_img = 0;
            var elorejelzes = channel.getElementsByTagName('item')[0].getElementsByTagName('koponyeg:elorejelzes')[0];
            document.getElementById('idojaras-status-bar-regio-label').setAttribute('value', regio + ' (' + varos + ')');
            document.getElementById('idojaras-status-bar-homerseklet').setAttribute('label', jelenido_homerseklet + ' °' + homerseklet);
            document.getElementById('idojaras-status-bar-homerseklet').setAttribute('tooltiptext', 'Jelenlegi hőmérséklet: ' + jelenido_homerseklet + ' °' + homerseklet);
            if (jelenido_szelsebesseg <= 0.8) {
                jelenido_szelirany = 'nowind'
            } else if (jelenido_szelsebesseg <= 5.5) {
                jelenido_szelirany_img = 0
            } else if (jelenido_szelsebesseg <= 12.0) {
                jelenido_szelirany_img = 0
            } else if (jelenido_szelsebesseg <= 19.5) {
                jelenido_szelirany_img = 0
            } else if (jelenido_szelsebesseg <= 28.7) {
                jelenido_szelirany_img = 1
            } else if (jelenido_szelsebesseg <= 38.6) {
                jelenido_szelirany_img = 2
            } else if (jelenido_szelsebesseg <= 49.8) {
                jelenido_szelirany_img = 3
            } else if (jelenido_szelsebesseg <= 61.7) {
                jelenido_szelirany_img = 3
            } else if (jelenido_szelsebesseg <= 74.6) {
                jelenido_szelirany_img = 3
            } else if (jelenido_szelsebesseg <= 87.9) {
                jelenido_szelirany_img = 3
            } else if (jelenido_szelsebesseg <= 102.3) {
                jelenido_szelirany_img = 4
            } else if (jelenido_szelsebesseg <= 117.5) {
                jelenido_szelirany_img = 5
            } else {
                jelenido_szelirany_img = 6
            }
            document.getElementById('idojaras-status-bar-icon-szelirany').setAttribute('tooltiptext', jelenido_szelszoveges);
            document.getElementById('idojaras-status-bar-icon-szelirany-label').setAttribute('value', jelenido_szelsebesseg + ' ' + sebesseg);
            switch (jelenido_szelirany) {
            case 'Változó':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/eny' + jelenido_szelirany_img + '.png');
                break;
            case 'nowind':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/nowind.png');
                break;
            case 'Nyugati':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/ny' + jelenido_szelirany_img + '.png');
                break;
            case 'NY/ÉNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/nyeny' + jelenido_szelirany_img + '.png');
                break;
            case 'ÉNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/eny' + jelenido_szelirany_img + '.png');
                break;
            case 'É/ÉNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/eeny' + jelenido_szelirany_img + '.png');
                break;
            case 'Északi':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/e' + jelenido_szelirany_img + '.png');
                break;
            case 'É/ÉK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/eek' + jelenido_szelirany_img + '.png');
                break;
            case 'ÉK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/ek' + jelenido_szelirany_img + '.png');
                break;
            case 'K/ÉK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/kek' + jelenido_szelirany_img + '.png');
                break;
            case 'Keleti':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/k' + jelenido_szelirany_img + '.png');
                break;
            case 'K/DK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/kdk' + jelenido_szelirany_img + '.png');
                break;
            case 'DK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/dk' + jelenido_szelirany_img + '.png');
                break;
            case 'D/DK-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/ddk' + jelenido_szelirany_img + '.png');
                break;
            case 'Déli':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/d' + jelenido_szelirany_img + '.png');
                break;
            case 'D/DNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/ddny' + jelenido_szelirany_img + '.png');
                break;
            case 'DNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/dny' + jelenido_szelirany_img + '.png');
                break;
            case 'NY/DNY-i':
                document.getElementById('idojaras-status-bar-icon-szelirany-image').setAttribute('src', 'chrome://idojaras/skin/szelirany/nydny' + jelenido_szelirany_img + '.png');
                break;
            default:
                alert('HIBA! "' + jelenido_szelirany + ' szélirány" nem beazonosítható! Kérlek jelezd a fejlesztőnek!');
                break
            }
            document.getElementById('idojaras-status-bar-min-label').setAttribute('value', elorejelzes.getAttribute('min') + ' °' + homerseklet);
            document.getElementById('idojaras-status-bar-min').setAttribute('tooltiptext', 'Napi minimum hőmérséklet: ' + elorejelzes.getAttribute('min') + ' °' + homerseklet);
            document.getElementById('idojaras-status-bar-max-label').setAttribute('value', elorejelzes.getAttribute('max') + ' °' + homerseklet);
            document.getElementById('idojaras-status-bar-max').setAttribute('tooltiptext', 'Napi maximum hőmérséklet: ' + elorejelzes.getAttribute('max') + ' °' + homerseklet);
            document.getElementById('idojaras-status-bar-csapadek-label').setAttribute('value', elorejelzes.getAttribute('csapadek') + ' ' + csapadek);
            document.getElementById('idojaras-status-bar-csapadek').setAttribute('tooltiptext', 'Várható napi csapadékmennyiség: ' + elorejelzes.getAttribute('csapadek') + ' ' + csapadek);
            jelenido_idokep = jelenido_idokep.toLowerCase();
            switch (jelenido_idokep) {
            case '':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/gyengenfelhos.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', ' A server adatai hibásak!');
                break;
            case 'gyengén felhős':
            case 'gyengén felhős ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/gyengenfelhos.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'zápor':
            case 'zápor ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/zapor.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'erősen felhős':
            case 'erősen felhős ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/erosenfelhos.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'eső':
            case 'eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/eso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'derült':
            case 'derült ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/derult.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'borult':
            case 'borult ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/borult.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'hózápor':
            case 'hózápor ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/hozapor.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'havazás':
            case 'havazás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/havazas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'zivatar':
            case 'zivatar ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/zivatar.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'köd':
            case 'köd ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/kod.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'felhőszakadás':
            case 'felhőszakadás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/felhoszakadas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'havas eső':
            case 'havas eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/havaseso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'ónos eső':
            case 'ónos eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/onoseso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'hófúvás':
            case 'hófúvás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/hofuvas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'szitálás, gyenge eső':
            case 'szitálás, gyenge eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/szitalas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'hószállingózás':
            case 'hószállingózás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/hoszallingozas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'hózivatar':
            case 'hózivatar ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/hozivatar.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'pára':
            case 'pára ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/para.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'tartósan ködös, borult':
            case 'tartósan ködös, borult ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/kodosborult.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'ködszitálás':
            case 'ködszitálás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/kodszitalas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'ónos ködszitálás':
            case 'ónos ködszitálás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/onosszitalas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'szeles':
            case 'szeles ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/szeles.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'kánikula':
            case 'kánikula ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/kanikula.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'zivatar záporesővel':
            case 'zivatar záporesővel ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/zaporzivatar.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'jégeső':
            case 'jégeső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/jegeso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'zord nap':
            case 'zord nap ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/fagy.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'közepesen felhős':
            case 'közepesen felhős ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/kozepesenfelhos.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'intenzív eső':
            case 'intenzív eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/intenziveso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'fagyott eső':
            case 'fagyott eső ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/fagyotteso.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'hódara':
            case 'hódara ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/hodara.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'graupel':
            case 'graupel ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/graupel.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            case 'intenzív havazás':
            case 'intenzív havazás ':
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('src', 'chrome://idojaras/skin/idokep/intenzivhavazas.png');
                document.getElementById('idojaras-status-bar-icon-idokep-image').setAttribute('tooltiptext', jelenido_idokep.charAt(0).toUpperCase() + jelenido_idokep.substr(1).toLowerCase());
                break;
            default:
                alert('HIBA! "' + jelenido_idokep + ' időkép" nem beazonosítható! Kérlek jelezd a fejlesztőnek!');
                break
            }
        } else {
            alert("Hiba! A server nem érhető el!")
        }
    }
}

function idojaras_rss_update() {
    idojaras_rss_keres();
    self.setTimeout('idojaras_rss_update()', 60000)
}
window.addEventListener("load", idojaras_rss_update, false);