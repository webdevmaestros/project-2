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


describe ('Billing Page', function() {

    it('a form should exist on the page', function(browser) {
      browser
        .url('http://localhost:8080/billing/')
        .assert
          .elementPresent('form[name="billing-form"]');
    });

    it('if the form is empty it is not submittable', function(browser) {
      browser
        .url('http://localhost:8080/billing/')
        .click('button.submit')
        .assert
          .urlEquals('http://localhost:8080/billing/');
    });

});

describe ('Payment Page', function() {

    it('a form should exist on the page', function(browser) {
      browser
        .url('http://localhost:8080/payment/')
        .assert
          .elementPresent('form[name="payment-form"]');
    });

    it('if the form is empty it is not submittable', function(browser) {
      browser
        .url('http://localhost:8080/payment/')
        .click('button.submit')
        .assert
          .urlEquals('http://localhost:8080/payment/');
    });

});

describe ('Store Page', function() {

    it('User can successfully add an item to the cart', function(browser) {
      this.store = browser.url('http://localhost:8080/store/');
      before(function(browser) {
        this.store
          .executeScript(function() {
            localStorage.clear();
            })
        })
      this.store
        .click('input#a0001')
        .click('button#submit')
        .assert
          .urlEquals('http://localhost:8080/pre-checkout/?')
        .assert
          .elementPresent('p.price');
    });


});
