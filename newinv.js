function caltotal(){
   $('#TotalAmount').val(Math.round($('#SalesAmount').val())+Math.round($('#FreeTaxSalesAmount').val())+Math.round($('#ZeroTaxSalesAmount').val())+Math.round($('#TaxAmount').val()));
}

function caldiscount(set){
  $('#mytable tr').each(function() {
     var trid = $(this).closest('tr').attr('id'); // table row ID
     if(trid.substring(0, 7)=='invbody'){
         pos = trid.substring(7);
         $('#UnitPrice_'+ pos).val(Math.round($('#UnitPrice_'+ pos).val()*set/100));
     }
   });
   calculatetax();
}

function calculatetax(){
   var amountx = 0;
   var amountz = 0;
   var amountf = 0;
   var amountt = 0;
   var tax = 0;
   var pos = '';
   $('#mytable tr').each(function() {
      var trid = $(this).closest('tr').attr('id'); // table row ID
      if(trid.substring(0, 7)=='invbody'){
          pos = trid.substring(7);
          $('#Amount_'+ pos).val($('#UnitPrice_'+ pos).val()*$('#Quantity_'+ pos).val());
          if($('#TaxTypeX_'+ pos).is(':checked')) {
             if($('input[name=TaxCal]:checked', '#newinv').val()=='IN'){
               $('#AmountX_'+ pos).val($('#Amount_'+ pos).val()/1.05);
               $('#Tax_'+ pos).val($('#Amount_'+ pos).val()-$('#AmountX_'+ pos).val());
             }else{
               $('#AmountX_'+ pos).val($('#Amount_'+ pos).val());
               $('#Tax_'+ pos).val($('#AmountX_'+ pos).val()*0.05);
             }
             $('#AmountZ_'+ pos).val(0);
             $('#AmountF_'+ pos).val(0);
          }
          if($('#TaxTypeF_'+ pos).is(':checked')) {
               $('#AmountX_'+ pos).val(0);
               $('#AmountZ_'+ pos).val(0);
               $('#AmountF_'+ pos).val($('#UnitPrice_'+ pos).val()*$('#Quantity_'+ pos).val());
               $('#Tax_'+ pos).val(0);
          }
          if($('#TaxTypeZ_'+ pos).is(':checked')) {
               $('#AmountX_'+ pos).val(0);
               $('#AmountZ_'+ pos).val($('#UnitPrice_'+ pos).val()*$('#Quantity_'+ pos).val());
               $('#AmountF_'+ pos).val(0);
               $('#Tax_'+ pos).val(0);
          }
          amountt += Number($('#Amount_'+pos).val());
          amountx += Number($('#AmountX_'+pos).val());
          amountz += Number($('#AmountZ_'+pos).val());
          amountf += Number($('#AmountF_'+pos).val());
          tax += Number($('#Tax_'+pos).val());
      }
    });
    $('#FreeTaxSalesAmount').val(Math.round(amountf));
    $('#ZeroTaxSalesAmount').val(Math.round(amountz));
   if($('input[name=TaxCal]:checked', '#newinv').val()=='IN'){
     if((Number(Math.round(amountt)) - Number($('#ZeroTaxSalesAmount').val()) - Number($('#FreeTaxSalesAmount').val()))>0){
        $('#TaxAmount').val(Math.round((Number(Math.round(amountt)) - Number($('#ZeroTaxSalesAmount').val()) - Number($('#FreeTaxSalesAmount').val()))/21));
     }else{
        $('#TaxAmount').val(0);
     }
     $('#SalesAmount').val( Number(Math.round(amountt)) - Number($('#TaxAmount').val()) - Number($('#ZeroTaxSalesAmount').val()) - Number($('#FreeTaxSalesAmount').val()) );
   }else{
     $('#SalesAmount').val(Math.round(amountx));
     $('#TaxAmount').val(Math.round(tax));
   }
  caltotal();
}

function getContent(a,k)
{
  $.ajax({
       type : "get",
       url : "/customer?page="+a+"&k="+k,
       timeout:5000,
       success:function(datas){
           $('.modal-body').html('');
           $('.modal-body').append(datas);
       },
  });
}

function getContent2(a,posi,k)
{
  var posi = $('#mytable tr').length - 2;
  $.ajax({
       type : "get",
       url : "/product?page="+a+"&posi="+posi+"&k="+k,
       timeout:5000,
       success:function(datas){
           $('.modal-body').html('');
           $('.modal-body').append(datas);
       },
  });
}

function isValidGUI(taxId) {
    var invalidList = "00000000,11111111";
    if (/^\d{8}$/.test(taxId) == false || invalidList.indexOf(taxId) != -1) {
        alert('統一編號需8碼');
    }

    var validateOperator = [1, 2, 1, 2, 1, 2, 4, 1],
        sum = 0,
        calculate = function(product) { // �衤�齿彍 + ��雿齿彍
            var ones = product % 10,
                tens = (product - ones) / 10;
            return ones + tens;
        };
    for (var i = 0; i < validateOperator.length; i++) {
        sum += calculate(taxId[i] * validateOperator[i]);
    }

    if( sum % 10 == 0 || (taxId[6] == "7" && (sum + 1) % 10 == 0)){
        $('#inputcode2').prop("disabled", true );
    }else{
        alert('統一編號有錯誤');
    }
}

function isTel(telId) {
    var reg =/^(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})$/;
    if(!reg.test(telId)){

        alert('電話號碼輸入有誤！');

    }else{

        return true;

    }
}

function checkEmail(email) {
    reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
    if (email.match(reg)) {
        return true;
    }else{
        alert('輸入正確email格式');
    }
}
function deleterow(ida){
    $(ida).remove();
    calculatetax();
}

function checknum(ida){
    if(!$.isNumeric(ida)){
        alert('甇斗�雿滚蘨�賣糓�彍摮�');
    }
}

function keyinputcode1(){
    $('#inputcode2').prop("disabled", true );
}

function keyinputcode2(){
    $('#inputcode1').prop("disabled", true );
}

function prodback(posi1,prod,price,taxtype,num,memo,unit,step=0){
    var item = $('#ItemCount').val();
    if(item==0){
       $('#ItemCount').val(1);
    }else{
       addrow();
    }
    var posi = $('#itemlist').attr('tag');
    console.log(posi);
    // console.log(aa);
    // var posi = $('#mytable tr').length - 2;
    $('#Description_'+ posi).val(prod);
    $('#UnitPrice_'+ posi).val(price);
    $('#Quantity_'+ posi).val(1);
    $('#Amount_'+ posi).val(price);
    $('#RelateNumber_'+ posi).val(num);
    $('#Remark_'+ posi).val(memo);
    $('#Unit_'+ posi).val(unit);
    switch(taxtype){
      case('TX'):
      $('#TaxTypeX_'+ posi).attr("checked",true);
      $('#SalesAmount_'+ posi).val(price);
      $('#FreeTaxSalesAmount_'+ posi).val(0);
      $('#ZeroTaxSalesAmount_'+ posi).val(0);
      break;
      case('TZ'):
      $('#TaxTypeZ_'+ posi).attr("checked",true);
      $('#SalesAmount_'+ posi).val(0);
      $('#FreeTaxSalesAmount_'+ posi).val(0);
      $('#ZeroTaxSalesAmount_'+ posi).val(price);
      $('#Tax_'+ posi).val(0);
      break;
      case(''):
      $('#TaxTypeF_'+ posi).attr("checked",true);
      $('#SalesAmount_'+ posi).val(0);
      $('#FreeTaxSalesAmount_'+ posi).val(price);
      $('#ZeroTaxSalesAmount_'+ posi).val(0);
      $('#Tax_'+ posi).val(0);
      break;
      default:
      $('#TaxTypeX_'+ posi).attr("checked",true);
      $('#SalesAmount_'+ posi).val(price);
      $('#FreeTaxSalesAmount_'+ posi).val(0);
      $('#ZeroTaxSalesAmount_'+ posi).val(0);
      break;
    }
    calculatetax();
    if(step==0){
      $('#exampleModalLong1').modal('toggle');
    }
}

function fdaback(posi){
    $.ajax({
         type : "get",
         url : "/fdasn",
         timeout:5000,
         success:function(datas){
            $('#Remark_'+ posi).val(datas);
         },
    });
}

function barcodeback(barcode){
    if(barcode.length>0){
      var posi = $('#mytable tr').length - 2;
      $.ajax({
           type : "get",
           url : "/barcode/"+barcode,
           timeout:5000,
           success:function(datas){
              if(datas.length>0){
                prodback(posi,datas[0],datas[1],datas[2],datas[3],datas[4],datas[5],1);
                $('#Barcode').val('');
                $('#Barcode').focus();
              }
           },
      });
    }
}

function activaTab(tab) {
  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function validate(form) {
    var c = confirm("�糓�炏摮䀹��?");
    $.blockUI();
    setTimeout($.unblockUI, 2000);
    return c; //you can just return c because it will be true or false
}

function addrow(){
  var aa = $('#itemlist').attr('tag');
  var sin = Number(aa)+Number(1);
  $('#itemlist').attr('tag',sin);
  var ctr = $('#itemlist').attr('tag');
  var pos = ctr;
  // var rowcount = $('#mytable tr').length;
  // var ctr = $('#itemlist').attr('tag');
  // var pos = ctr;
  var custno = $('#APP_CUSTNO').val();
  if(custno==2){
    memobtn = '<button type="button" class="btn btn-default" onClick="fdaback('+pos+')">��硋�㛖𤩎��餈賣滲蝣�</button>';
  }else{
    memobtn = '';
  }
  $("#mytable").find("tbody").append('\
     <tr name="invbody'+ctr+'" id="invbody'+ctr+'">\
        <th scope="row">\
           <input class="Description form-control" name="Description['+ctr+']" id="Description_'+pos+'" type="text" placeholder="" value="" autocomplete="off" required>\
        </th>\
        <td>\
           <input class="Unit form-control" name="Unit['+ctr+']" id="Unit_'+pos+'" type="text" placeholder="" value="">\
        </td>\
        <td>\
           <input class="UnitPrice form-control" name="UnitPrice['+ctr+']" id="UnitPrice_'+pos+'" type="number" placeholder="" value="" onChange="calculatetax()" step="0.01" required>\
        </td>\
        <td>\
           <input class="Quantit form-control" name="Quantity['+ctr+']" id="Quantity_'+pos+'" type="number" value="" onChange="calculatetax()" required>\
        </td>\
        <td>\
           <input class="Amount form-control" name="Amount['+ctr+']" id="Amount_'+pos+'" type="number" placeholder="" value="" step="0.01" required>\
           <input name="Tax['+ctr+']" id="Tax_'+pos+'" type="hidden" placeholder="" value="0" required>\
           <input name="AmountX['+ctr+']" id="AmountX_'+pos+'" type="hidden" placeholder="" value="0">\
           <input name="AmountZ['+ctr+']" id="AmountZ_'+pos+'" type="hidden" placeholder="" value="0">\
           <input name="AmountF['+ctr+']" id="AmountF_'+pos+'" type="hidden" placeholder="" value="0">\
        </td>\
        <td>\
           <label><input name="TaxType['+ctr+']" id="TaxTypeX_'+pos+'" type="radio" value="TX" checked onChange="calculatetax()">應稅</label>\
           <label><input name="TaxType['+ctr+']" id="TaxTypeF_'+pos+'" type="radio" value="" onChange="calculatetax()">免稅</label>\
           <label><input name="TaxType['+ctr+']" id="TaxTypeZ_'+pos+'" type="radio" value="TZ" onChange="calculatetax()">零稅</label>\
        </td>\
        <td>\
          <input class="RelateNumber form-control" name="RelateNumber['+ctr+']" id="RelateNumber_'+pos+'" type="text" placeholder="" value="" autocomplete="off">\
        </td>\
        <td>\
          <input class="Remark form-control" name="Remark['+ctr+']" id="Remark_'+pos+'" type="text" placeholder="" value="" autocomplete="off">\
          '+memobtn+'\
        </td>\
        <td>\
        <a href="#" onClick="deleterow(\'#invbody'+ctr+'\')">X</a>\
        </td>\
     </tr>');
     $('#UnitPrice_'+ pos).attr('step',$('#decimalpoint').val());
     $('#Amount_'+ pos).attr('step',$('#decimalpoint').val());
}

function findcustomer(){
    $.ajax({
         type : "get",
         url : "/customer?k="+$('#find').val(),
         timeout:5000,
         success:function(datas){
             $('.modal-body').html('');
             $('.modal-body').append(datas);
             $('.modal-footer').html('');
             $('.modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">��𣈯��</button>');
         },
    });
}

function findproduct(){
    posi = $('#posi').val();
    $.ajax({
         type : "get",
         url : "/product?k="+$('#find1').val()+"&posi="+posi,
         timeout:5000,
         success:function(datas){
             $('.modal-body').html('');
             $('.modal-body').append(datas);
             $('.modal-footer').html('');
             $('.modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">��𣈯��</button>');
         },
    });
}