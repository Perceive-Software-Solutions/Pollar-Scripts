
//Intsance class for migrate singleton
class MigrateSingleton {

  constructor() {
    this.userInfoIDMap = {};
    this.userMainIDMap = {};
    this.userMain2Info = {};
    this.categoryIDMap = {};
    this.topicIDMap = {};
    this.pollIDMap = {};
    this.postIDMap = {};
    this.chatIDMap = {};
    this.userSettingID2userMainID = {};
    this.notificationIDMap = {};
  }

}

//Singleton used within data transfer and id reassignment
class Singleton {

  constructor() {
    if(!Singleton.instance){
      Singleton.instance = new MigrateSingleton();
    }
  }

  getInstance(){
    return Singleton.instance;
  }

}

module.exports = Singleton;