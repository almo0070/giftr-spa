let app={
    key:"persons",
    currentPerson:"x",
    persons:[
    ],    

    init: ()=>{

        app.setObserver();

        app.loadPersons();
        app.eventListeners();

    },

    setObserver: () => {
        let header = document.querySelector('header'); 
            
            let config = {
                attributes: true, 
                attributeOldValue: true,
                attributeFilter: ['data-state'],
                childList: false, 
                subtree: false, 
                characterData: false,
                characterDataOldValue: false
            };
            
            observer = new MutationObserver(app.mutated);
            observer.observe(header, config);

        
    },

    eventListeners: () => {
        let addPerson=document.getElementById("add");
        addPerson.addEventListener("click",app.personForm)

        let svePerson=document.getElementById("savePerson");
        svePerson.addEventListener("click",app.savePerson)


        let sveGift=document.getElementById("saveGift");
        sveGift.addEventListener("click",app.saveGift)
    },
    
    delPerson: (ev) => {
        let id = ev.target.getAttribute("data-id");
        let index=app.persons.findIndex(element => element.id==id);
        app.persons.splice(index,1);
        document.getElementById("pList").removeChild(ev.target.parentElement);
        localStorage.setItem(app.key,JSON.stringify(app.persons));
    },
    delGift: (ev) => {
        if (app.currentPerson == "x")
        {
            console.log("No Current Person");
        }else{
            let pIndex = app.persons.findIndex(element => element.id==app.currentPerson);
            let gId = ev.target.getAttribute("data-id");
            let gIndex=app.persons[pIndex].gifts.findIndex(element => element.id==gId);
            app.persons[pIndex].gifts.splice(gIndex,1);
            document.getElementById("gList").removeChild(ev.target.parentElement);
            localStorage.setItem(app.key,JSON.stringify(app.persons));
        }
    },
    saveGift:()=>{
        let pId=app.currentPerson;
        let person = app.persons.find(person=> person.id == pId);
        let personId = app.persons.findIndex(person=> person.id == pId);
        let gList = document.getElementById("gList");
        console.log( personId );
        
        app.persons[personId].gifts.push({
            gid:Date.now(),
            gname:document.getElementById("gname").value,
            price:document.getElementById("gprice").value,
            store:document.getElementById("gstore").value,
            link:document.getElementById("glink").value
        });
        gList.innerText="";
        app.giftsShow();

        localStorage.setItem(app.key,JSON.stringify(app.persons));
        document.querySelector('header').setAttribute('data-state','giftList');
        console.log(document.querySelector('header').getAttribute('data-state'));
    },
    savePerson:()=>{
        
        let bd1=new Date(document.getElementById("bdate").value);
        let dateArray = bd1.toDateString().split(" ");
        
        let month = dateArray[1];
        let dayNam = dateArray[0];
        let dayNum = dateArray[2];
        let year = dateArray[3];
        app.persons.push({
            id:Date.now(),
            name:document.getElementById("pname").value,
            birth:month,
            gifts:[{}]
        });
        pList.innerText="";
        app.displayPersons();
        localStorage.setItem(app.key,JSON.stringify(app.persons));
        app.currentPerson="x";
        document.querySelector('header').setAttribute('data-state','peopleList')
        console.log(document.querySelector('header').getAttribute('data-state'));
    },
    personForm:()=>{
        if (app.currentPerson=="x"){
            document.querySelector('header').setAttribute('data-state','addPeople')
        }else{
            document.querySelector('header').setAttribute('data-state','addGift')
        }
        console.log(document.querySelector('header').getAttribute('data-state'));

    },
    loadPersons:()=>{
       
       let data = localStorage.getItem(app.key);
       if (data) {
           app.persons= JSON.parse(data);
        let pList = document.getElementById("pList");
        app.displayPersons();
       }else{
        pList.innerText="No persons"
       }
    },
    displayPersons:() =>{
        let pList = document.getElementById("pList");
        console.log(pList);

        app.persons.forEach(person => {
            console.log(pList);
            let lperson = document.createElement('li');
            lperson.setAttribute("data-id",person.id);
            lperson.setAttribute("class","lperson");
            let lName = document.createElement('span');
            lName.textContent=person.name;
            let lBD = document.createElement('span');
            lBD.textContent=person.birth;
            
            let delImg = document.createElement('i');
            delImg.className = "fas fa-trash-alt";
            delImg.addEventListener("click",app.delPerson);

            lperson.appendChild(lBD);
            lperson.appendChild(lName);
            
            lperson.appendChild(delImg);
            pList.appendChild(lperson);

            lperson.addEventListener("click",app.giftsShow)
            document.querySelector('header').setAttribute('data-state','peopleList');
            console.log(document.querySelector('header').getAttribute('data-state'));
        })
    },
    giftsShow:(ev)=>{
        //let pId=ev.target.getAttribute("data-id");
        let pId;
        if (ev){
            pId=ev.currentTarget.getAttribute("data-id");
            app.currentPerson=pId;
        }else{
            pId=app.currentPerson;
        }
        // pId=ev.currentTarget.getAttribute("data-id");
        // app.currentPerson=pId;
        let person = app.persons.find(person=> person.id == pId);
        let gList = document.getElementById("gList");
        gList.innerHTML="";
        console.log( "person: "+person );
        console.log( "person.gifts.length: "+person.gifts.length );
        if (person.gifts.length > 0){
            person.gifts.forEach (gift => {
                let lgift = document.createElement('li');
                lgift.setAttribute("data-id",gift.id);
                lgift.setAttribute("class","lgift");
                let lName = document.createElement('span');
                lName.textContent=gift.gname;
                let lPrice = document.createElement('span');
                lPrice.textContent=gift.price;
                let lStore = document.createElement('span');
                lStore.textContent=gift.store;
                let ancr = document.createElement('a');
                let lLink = document.createElement('span');
                lLink.textContent=gift.link;
                
    
                let delImg = document.createElement('i');
                delImg.className = "fas fa-trash-alt";
                delImg.addEventListener("click",app.delGift);
    
                lgift.appendChild(lName);
                lgift.appendChild(lPrice);
                lgift.appendChild(lStore);
                ancr.appendChild(lLink);
                lgift.appendChild(ancr);
                lgift.appendChild(delImg);
                gList.appendChild(lgift);
                
            });
        }else{
            let lgift = document.createElement('li');
                lgift.setAttribute("data-id",gift.id);
                lgift.setAttribute("class","lgift");
                let lNoGift = document.createElement('span');
                lNoGift.textContent="No gifts";
                lgift.appendChild(lNoGift);
                gList.appendChild(lgift);
        }
        document.querySelector('header').setAttribute('data-state','giftList');
                console.log(document.querySelector('header').getAttribute('data-state'));
    },
    mutated:(mutationList) => {
        console.log("mutationList "+mutationList);

        let currentState = mutationList[0].target.getAttribute('data-state')

        document.querySelectorAll('#right>div').forEach(item => {
            item.classList.add('hideform')
        })
        

        document.querySelector('.addPeople').classList.add('hideform');
        //document.querySelector('.peopleList').classList.add('hideform');
        document.querySelector('.giftList').classList.add('hideform');
        document.querySelector('.addGift').classList.add('hideform');

        switch (currentState) {
            case 'peopleList':
                document.querySelector('.peopleList').classList.remove('hideform')
                break;
            case 'addPeople':
                document.querySelector('.addPeople').classList.remove('hideform')
                break;
            case 'giftList':
                document.querySelector('.giftList').classList.remove('hideform')
                break;
            case 'addGift':
            case 'giftForm':
                document.querySelector('.addGift').classList.remove('hideform')
                break;
            default:
                break;
        }  
    }
}

document.addEventListener("DOMContentLoaded", app.init);