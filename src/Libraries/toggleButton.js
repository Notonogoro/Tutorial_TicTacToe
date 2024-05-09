export function registerToggleButton(){
    var allBtns = document.querySelectorAll('.btn-holder');

for(let i = 0; i < allBtns.length; i++){
    var btn = allBtns[i];


    btn.addEventListener('click', function(){
        var allNodes = btn.children;

        // find all childern and check them for add class and checkbox state
        for(let j = 0; j< allNodes.length; j++){
            var node = allNodes[j];
            var isActive;

            if(node.classList.contains('btn-circle')){
                if(!node.classList.contains('active')){

                    node.classList.add('active');
                    isActive = true;
                }else {
                    node.classList.remove('active');
                    isActive = false;
                }
            }

            // check for check box and change it's state
            if (node.classList.contains('checkbox')){

                if (isActive){
                console.log(node);

                    node.checked = true;
                } else {
                    node.checked = false;
                }
            }
        }
    })
}
}