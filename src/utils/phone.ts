export class PhoneNumberValidator {
  private static readonly Brazil_DDDs = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '21',
    '22',
    '24',
    '27',
    '28',
    '31',
    '32',
    '33',
    '34',
    '35',
    '37',
    '38',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '51',
    '53',
    '54',
    '55',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '71',
    '73',
    '74',
    '75',
    '77',
    '79',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
  ]

  public static validateAndFormat(phoneNumber: string): string | null {
    // Remover caracteres não numéricos do número
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')

    const ddi = cleanPhoneNumber.slice(0, 2)

    let formattedPhoneNumber = cleanPhoneNumber
    if (ddi === '55') {
      const phoneWithoutDDI = cleanPhoneNumber.slice(2)
      // Verificar se o número possui o DDD correto
      const isValidDDD = PhoneNumberValidator.Brazil_DDDs.some((ddd) =>
        phoneWithoutDDI.startsWith(ddd),
      )
      if (!isValidDDD) {
        return null
      }

      // Verificar se o número possui 9 ou 8 dígitos
      const hasValidLength =
        phoneWithoutDDI.length === 11 || phoneWithoutDDI.length === 10
      if (!hasValidLength) {
        return null
      }

      // Formatar o número
      if (phoneWithoutDDI.length === 11) {
        formattedPhoneNumber = `(${ddi}) ${phoneWithoutDDI.slice(2, 7)}-${phoneWithoutDDI.slice(7)}`
      } else {
        formattedPhoneNumber = `(${ddi}) ${phoneWithoutDDI.slice(2, 6)}-${phoneWithoutDDI.slice(6)}`
      }
    }

    return formattedPhoneNumber
  }
}
