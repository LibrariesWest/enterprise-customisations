function changeWelcomeMessage () {
    var welcomeText = jQuery('.welcome').text();
    var removeWelcome = welcomeText.split('Welcome')[1];
    var userNameText = removeWelcome.split(',');
    var newUserNameText = userNameText[1] + userNameText[0];
    var newWelcomeText = 'Welcome ' + newUserNameText;
    jQuery('.welcome').text(newWelcomeText);
}

/* function updateDates () {
    var origLastActivityDate = $J('#lastActivityDate_span_data').find('input').val();
    var lastActivityDateArray = origLastActivityDate.split('-');
    var euroLastActivityDate = lastActivityDateArray[2]+'/'+lastActivityDateArray[1]+'/'+lastActivityDateArray[0];
    $J('#lastActivityDate_span_data').find('input').val(euroLastActivityDate);

    var origBirthDate = $J('#birthDate_span_data').find('input').val();
    var birthDateArray = origBirthDate.split('-');
    var euroBirthDay = birthDateArray[2]+'/'+birthDateArray[1]+'/'+birthDateArray[0];
    $J('#birthDate_span_data').find('input').val(euroBirthDay);
}  */

function customJavaScript() {
    /* waitForMyAccountData(); */
    secureMarketline();
    addMarketlineLink();
    
    var requestLink = '<div style="margin-top:30px; text-align:center;"><a href="https://www.librarieswest.org.uk/client/en_GB/default/?rm=INTER+LIBRARY+0|||1|||0|||true">Can&#39;t find what you&#39;re looking for?</a></div>';
	jQuery('#no_results_wrapper .didYouMeansWrapper').append(requestLink); 
}

function waitToDoSomething(){
    var curAttempt = 0;
    var maxAttempts = 40;
    if (jQuery('.welcome').length == 0){
        curAttempt++;
        if(curAttempt<=maxAttempts){
            setTimeout("waitToDoSomething()",500);
        }// if 1
    }// if 2
    else{
        changeWelcomeMessage ();
    }// else    
}// function


/* function waitForMyAccountData (){
    var curAttempt = 0;
    var maxAttempts = 40;
    if (jQuery('#myAccount_contactInfo_header').length == 0){
        curAttempt++;
        if(curAttempt<=maxAttempts){
            setTimeout("waitForMyAccountData ()",500);
        }// if 1
    }// if 2
    else{
        updateDates ();
    }// else    
}// function */

//Marketline Room Link

function secureMarketline () {
	$J('.room_links a[href*="rm=MARKETLINE+ADV"]').click(function(){
	com_sirsi_ent_login.loginFirst(allowMe);
	return false;  
	});
}

function allowMe () {
    window.location.assign('/client/en_GB/default/?rm=MARKETLINE+ADV1%7C%7C%7C1%7C%7C%7C0%7C%7C%7Ctrue');
}

function addMarketlineLink () {
    var marketLineLink = '. <a href="https://lwc.sirsidynix.net.uk/uhtbin/marketline.php" target="_blank">Click here to access Marketline</a>';
    var marketLineNotLoggedInLink = '. <a href="#" onclick="com_sirsi_ent_login.loginFirst()">You must login to access Marketline</a>';
    if (com_sirsi_ent_login.isLoggedIn === true) {
        $J('#marketlineTagLine span#marketlineLink').html(marketLineLink);
    } else {
        $J('#marketlineTagLine span#marketlineLink').html(marketLineNotLoggedInLink);
    }
}

function editHoldTableWithCost(){
    if ($J('#holdTable select.pickupSelect') && $J('#holdTable select.pickupSelect').length > 0) {
        var prices = {
            "Unknown": "Unknown",
            "BN": "Free",
            "BS": "Free",
            "DO": "Free",
            "NS": "£1 except children and young adults (free), mobile library users (50p) and access members (free for spoken word & large print books)",
            "PO": "£1 except children's DVDs & children's and teenage books (free)",
            "SO": "£1 except requests placed by children on children's books (free), requests placed by children on items other than children's books (50p)",
            "SG": "£1.10 except requests made by concessionary users on books & audio books (50p) and CDs and computer games (free), and requests made by children & young adults (free)."
        };
        var selectedholdlibrary = $J('#holdTable select.pickupSelect').val();
        $J('#holdTable tbody tr.customPriceDisplay').remove();
        $J('#holdTable tbody').append('<tr class="customPriceDisplay"><td colspan="2" class="align: right">Hold charges may apply.  Estimated cost: ' + prices[(selectedholdlibrary.substring(0, 2) || "Unknown")] + '</td></tr>')
    }
}

function setCatalogueSearchPlaceholder(){
    $J('input#q.suggestFieldBlur').attr('placeholder', 'search library catalogue');
}

function modifyBookRiverLink(){
    var updateRiverButtonIterations = 0;
    var updateRiverButton = setInterval(function(){
        updateRiverButtonIterations++;
        var buttons = jQuery('div.nytimes_check_lib_div input.button');
        if (buttons && buttons.length > 0) {
            buttons.val('More Details');
            clearInterval(updateRiverButton);
            jQuery('.nytimes_select').change(function(e){
                modifyBookRiverLink();
            });
        }
        if (updateRiverButtonIterations > 20) clearInterval(updateRiverButton);
    }, 100)
}

function modifyEverythingSearchLimitText(){
    $J('#searchLimitDropDown option[value=""]').text('All Catalogue');
}

$J(document).ready(function(){
    addMarketlineLink();
    waitToDoSomething();
    setCatalogueSearchPlaceholder();
    modifyBookRiverLink();
    modifyEverythingSearchLimitText();
    //$J('#holdTable select.pickupSelect').change(function(e){
        //editHoldTableWithCost();
    //});
});