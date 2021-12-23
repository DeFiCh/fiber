context('Wallet - Loans - Vault Details', () => {
  let vaultId = ''

  before(function () {
    cy.createEmptyWallet(true)
    cy.sendDFItoWallet().sendDFITokentoWallet().sendTokenToWallet(['BTC']).wait(6000)
    cy.getByTestID('bottom_tab_loans').click()
    cy.getByTestID('empty_vault').should('exist')
    cy.createVault(0)
    cy.getByTestID('vault_card_0_manage_loans_button').should('not.exist')
    cy.getByTestID('vault_card_0_vault_id').then(($txt: any) => {
      vaultId = $txt[0].textContent
    })
    cy.getByTestID('vault_card_0_edit_collaterals_button').click()
    cy.addCollateral('10', 'DFI')
    cy.addCollateral('10', 'dBTC')
    cy.go('back')
    cy.wait(2000)
  })

  it('should add loan', function () {
    cy.getByTestID('vault_card_0_manage_loans_button').click()
    cy.getByTestID('button_browse_loans').click()
    cy.getByTestID('loan_card_DUSD').click()
    cy.getByTestID('form_input_borrow').clear().type('100').blur()
    cy.wait(3000)
    cy.getByTestID('text_input_usd_value').should('have.value', '100.00')
    cy.getByTestID('borrow_loan_submit_button').click()
    cy.getByTestID('button_confirm_borrow_loan').click().wait(3000)
    cy.closeOceanInterface()
  })

  it('should edit loan scheme', function () {
    cy.getByTestID('vault_card_0').click()
    // Vault should not be able to close if there are existing loans
    cy.getByTestID('vault_detail_close_vault').should('have.attr', 'aria-disabled')
    cy.getByTestID('vault_detail_edit_collateral').click()
    cy.url().should('include', 'Loans/EditCollateralScreen')
    cy.go('back')
    cy.wait(2000)
    cy.getByTestID('vault_detail_edit_loan_scheme').click()
  })

  it('should be able to edit loan scheme', function () {
    cy.getByTestID('loan_scheme_option_1').click()
    cy.getByTestID('edit_loan_scheme_submit_button').click()
    cy.getByTestID('edit_loan_scheme_title').contains('You are editing scheme of vault')
    cy.getByTestID('edit_loan_scheme_vault_id').contains(vaultId)
    cy.getByTestID('text_transaction_type').contains('Edit loan scheme')
    cy.getByTestID('prev_min_col_ratio').contains('150.00')
    cy.getByTestID('prev_vault_interest').contains('5.00')
    cy.getByTestID('new_min_col_ratio').contains('175.00')
    cy.getByTestID('new_vault_interest').contains('3.00')
    cy.getByTestID('button_confirm_edit_loan_scheme').click()
    cy.getByTestID('txn_authorization_description').contains('Updating vault to min. collateralization ratio of 175% and interest rate of 3%')
    cy.closeOceanInterface()
    cy.getByTestID('vault_card_0_min_ratio').contains('175%')
    cy.getByTestID('vault_card_0').click()
    cy.getByTestID('vault_id_section_min_ratio').contains('175%')
    cy.getByTestID('text_vault_interest').contains('3')
    cy.getByTestID('collateral_tab_DETAILS').click()
    cy.getByTestID('text_min_col_ratio').contains('175.00')
    cy.getByTestID('text_vault_interest_ratio').contains('3.00')
  })
})
