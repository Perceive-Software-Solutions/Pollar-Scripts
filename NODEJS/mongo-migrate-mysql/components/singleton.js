
//Intsance class for migrate singleton
class MigrateSingleton {

  constructor() {
    this.userIDMap = {};
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