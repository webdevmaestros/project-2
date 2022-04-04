describe ('Landing Page', function() {

    it('a form should exist on the page', function(browser) {
      browser
        .url('http://localhost:8080/')
        .assert
          .elementPresent('form[name="shipping-form"]');
    });

    it('if the form is empty it is not submittable', function(browser) {
      browser
        .url('http://localhost:8080/')
        .click('button.submit')
        .assert
          .urlEquals('http://localhost:8080/');
    });

});
