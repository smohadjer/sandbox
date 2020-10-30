<?php
	if (isset($_POST)) {
	   echo($_POST['submitbutton']);
	}
?>
<form id="starterWizard__form" class="starterWizard__form" action="twoSubmitButtons.php" method="post"></form>
<!-- my form fields -->
<input name="username" form="starterWizard__form" />
<input type="submit" class="btn btn-primary" name="submitbutton" value="Save and Exit" form="starterWizard__form">
<input type="submit" class="btn btn-primary" name="submitbutton" value="Continue" form="starterWizard__form">
