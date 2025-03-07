export enum AdyenActionType {
    /*
     * The payment qualifies for 3D Secure 2, and will go through either the frictionless
     * or the challenge flow.
     * */
    ThreeDS2Fingerprint = 'threeDS2Fingerprint',

    /*
     * The payment qualifies for 3D Secure 2, and the issuer is initiating a challenge flow.
     * */
    ThreeDS2 = 'threeDS2',

    /*
     * We will initiate a 3D Secure 1 fallback, because the issuer does not support 3D Secure 2.
     * */
    Redirect = 'redirect',

    /*
     * The Component presents the QR code and calls the onAdditionalDetails event.
     * */
    QRCode = 'qrCode',

    /*
     * The Component displays the voucher which the shopper uses to complete the payment.
     * */
    Voucher = 'voucher',

    /*
     * The Component displays the widget which the shopper uses to complete the payment.
     * */
    Sdk = 'sdk',
}

export enum AdyenComponentType {
    SecuredFields = 'securedfields',
}

export enum AdyenPaymentMethodType {
    ACH = 'ach',
    AliPay = 'alipay',
    Bancontact = 'bcmc',
    CreditCard = 'scheme',
    Klarna = 'klarna',
    KlarnaPayNow = 'klarna_paynow',
    KlarnaAccount = 'klarna_account',
    IDEAL = 'ideal',
    GiroPay = 'giropay',
    GooglePay = 'paywithgoogle',
    SEPA = 'sepadirectdebit',
    Sofort = 'directEbanking',
    Vipps = 'vipps',
    WeChatPayQR = 'wechatpayQR',
}

export enum HTTPMethod {
    POST = 'POST',
}

export enum ResultCode {
    ChallengeShopper = 'ChallengeShopper',
    Error = 'Error',
    IdentifyShopper = 'IdentifyShopper',
}

interface AdyenPaymentMethodState {
    type: string;
}

interface WechatDataPaymentMethodState {
    paymentMethod: AdyenPaymentMethodState;
}

interface CardPaymentMethodState {
    encryptedCardNumber: string;
    encryptedExpiryMonth: string;
    encryptedExpiryYear: string;
    encryptedSecurityCode: string;
    holderName: string;
}

export interface AdyenAction {
    method: HTTPMethod;

    /**
     * Value that you need to submit in your /payments/details request when handling
     * the redirect.
     */
    paymentData: string;

    paymentMethodType: AdyenPaymentMethodType;

    /*
     * The Component performs additional front-end actions depending on the action.type.
     * Your next steps depend on the type of action that the Component performs.
     */
    type: AdyenActionType;

    /**
     * The HTTP request method that you should use. After the shopper completes the payment,
     * they will be redirected back to your returnURL using the same method.
     */
    url: string;
}

export interface AdyenAdditionalAction {
    resultCode: ResultCode;
    action: string;
}

export interface AdyenAdditionalActionCallbacks {
    /**
     * A callback that gets called before adyen component is loaded
     */
    onBeforeLoad?(shopperInteraction?: boolean): void;

    /**
     * A callback that gets called when adyen component is loaded
     */
    onLoad?(cancel?: () => void): void;

    /**
     * A callback that gets called when adyen component verification
     * is completed
     */
    onComplete?(): void;
}

export interface AdyenAdditionalActionErrorResponse {
    provider_data: AdyenAdditionalAction;
    errors: [
        {
            code: string;
        },
    ];
}

export interface AdyenAdditionalActionOptions extends AdyenAdditionalActionCallbacks {
    /**
     * The location to insert the additional action component.
     */
    containerId: string;

    /**
     * Specify Three3DS2Challenge Widget Size
     *
     * Values
     * '01' = 250px x 400px
     * '02' = 390px x 400px
     * '03' = 500px x 600px
     * '04' = 600px x 400px
     * '05' = 100% x 100%
     */
    widgetSize?: string;
}

export interface AdyenAdditionalActionState {
    data: AdyenAdditionalAction;
    isValid?: boolean;
}

export interface AdyenBaseCardComponentOptions {
    /**
     * Array of card brands that will be recognized by the component.
     *
     */
    brands?: string[];

    /**
     * Set a style object to customize the input fields. See Styling Secured Fields
     * for a list of supported properties.
     */
    styles?: StyleOptions;

    showBrandsUnderCardNumber?: boolean;
}

export interface AdyenComponentEvents {
    /**
     * Called when the shopper enters data in the card input fields.
     * Here you have the option to override your main Adyen Checkout configuration.
     */
    onChange?(state: AdyenV3ComponentState, component: AdyenComponent): void;

    /**
     * Called when the shopper selects the Pay button and payment details are valid.
     */
    onSubmit?(state: AdyenV3ComponentState, component: AdyenComponent): void;

    /**
     * Called in case of an invalid card number, invalid expiry date, or
     *  incomplete field. Called again when errors are cleared.
     */
    onError?(state: AdyenV3ValidationState, component: AdyenComponent): void;

    onFieldValid?(state: AdyenV3ValidationState, component: AdyenComponent): void;
}

export interface AdyenClient {
    create(type: string, componentOptions?: AdyenComponentOptions): AdyenComponent;

    createFromAction(
        action: AdyenAction,
        componentOptions?:
            | ThreeDS2DeviceFingerprintComponentOptions
            | ThreeDS2ChallengeComponentOptions,
    ): AdyenComponent;
}

export interface AdyenComponent {
    componentRef?: {
        showValidation(): void;
    };
    props?: {
        type?: string;
    };
    state?: CardState;
    mount(containerId: string): HTMLElement;
    unmount(): void;
    submit(): void;
}

export interface AdyenConfiguration {
    /*
     * Use test, and then change this to live when you're ready to accept live payments.
     */
    environment?: string;

    /*
     * The shopper's locale. This is used to set the language rendered in the Components.
     */
    locale?: string;

    /*
     * The Origin Key of your website.
     */
    originKey?: string;

    /*
     * The Client Key of your Adyen account.
     */
    clientKey?: string;

    /*
     * Supported from Components version 3.0.0 and later. The full paymentMethods response,
     * returned in step 1. We recommend that you pass this on the AdyenCheckout instance.
     * Otherwise, you need to pass the specific payment method details separately for each
     * Component.
     */
    paymentMethodsResponse?: PaymentMethodsResponse;

    /**
     * Configuration for specific payment methods.
     */
    paymentMethodsConfiguration: {
        klarna: {
            useKlarnaWidget: boolean;
        };
        klarna_account: {
            useKlarnaWidget: boolean;
        };
        klarna_paynow: {
            useKlarnaWidget: boolean;
        };
    };

    showPayButton?: boolean;

    /**
     * If your shoppers use a language that isn't supported by the Components, you can create your own localization.
     * To create a localization:
     * Add a translations object to your payment page, specifying:
     * The localization you want to create.
     * An object containing the fields that are used in the Components, as well as the text you want displayed for each field.
     *
     * "en": {
     *  "paymentMethods.moreMethodsButton": "More payment methods",
     *  "payButton": "Pay",
     *  "storeDetails": "Save for my next payment",
     *   ...
     * }
     */
    translations?: {
        [index: string]: {
            [index: string]: string;
        };
    };

    /*
     * Specify the function that you created, for example, handleOnChange. If you wish
     * to override this function, you can also define an onChange event on the Component
     * level.
     */
    onChange?(state: CardState, component?: AdyenComponent): void;

    onAdditionalDetails?(state: CardState, component?: AdyenComponent): void;
}

export interface AdyenPlaceholderData {
    holderName?: string;
    billingAddress?: {
        street: string;
        houseNumberOrName: string;
        postalCode: string;
        city: string;
        stateOrProvince: string;
        country: string;
    };
}

export interface AdyenV3CreditCardComponentOptions
    extends AdyenBaseCardComponentOptions,
        AdyenComponentEvents {
    /**
     * Set an object containing the details array for type: scheme from
     * the /paymentMethods response.
     */
    details?: InputDetail[];

    /**
     * Set to true to show the checkbox to save card details for the next payment.
     */
    enableStoreDetails?: boolean;

    /**
     * Set to true to request the name of the card holder.
     */
    hasHolderName?: boolean;

    /**
     * Set to true to require the card holder name.
     */
    holderNameRequired?: boolean;

    /**
     * Information to prefill fields.
     */
    data?: AdyenPlaceholderData;

    /**
     * Defaults to ['mc','visa','amex']. Configure supported card types to
     * facilitate brand recognition used in the Secured Fields onBrand callback.
     * See list of available card types. If a shopper enters a card type not
     * specified in the GroupTypes configuration, the onBrand callback will not be invoked.
     */
    groupTypes?: string[];

    /**
     * Specify the sample values you want to appear for card detail input fields.
     */
    placeholders?: CreditCardPlaceHolder | SepaPlaceHolder;
}

export interface AdyenCustomCardComponentOptions
    extends AdyenBaseCardComponentOptions,
        AdyenComponentEvents {
    /**
     * Specify aria attributes for the input fields for web accessibility.
     */
    ariaLabels?: CustomCardAriaLabels;

    /**
     * Automatically shift the focus from date field to the CVC field.
     */
    autofocus?: boolean;
}

export interface AdyenError {
    errorCode: string;
    message: string;
}

type AdyenClientConstructor = (configuration: AdyenConfiguration) => Promise<AdyenClient>;

export interface AdyenHostWindow extends Window {
    AdyenCheckout?: AdyenClientConstructor;
}
export interface AdyenV3IdealComponentOptions {
    /**
     * Optional. Set to **false** to remove the bank logos from the iDEAL form.
     */
    showImage?: boolean;
}

export interface AdyenStoredPaymentMethod {
    /**
     * The brand of the card.
     */
    brand?: string;

    /**
     * The month the card expires.
     */
    expiryMonth?: string;

    /**
     * The year the card expires.
     */
    expiryYear?: string;

    /**
     * The unique payment method code.
     */
    holderName?: string;

    /**
     * A unique identifier of this stored payment method.
     */
    id?: string;

    /**
     * The last four digits of the PAN.
     */
    lastFour?: string;

    /**
     * The display name of the stored payment method.
     */
    name: string;

    /**
     * The shopper’s email address.
     */
    shopperEmail?: string;

    /**
     * The supported shopper interactions for this stored payment method.
     */
    supportedShopperInteractions?: string[];

    /**
     * The type of payment method.
     */
    type?: string;
}

export interface Bank {
    /**
     * The bank account number (without separators).
     */
    bankAccountNumber?: string;

    /**
     * The bank city.
     */
    bankCity?: string;

    /**
     * The location id of the bank. The field value is nil in most cases.
     */
    bankLocationId?: string;

    /**
     * The name of the bank.
     */
    bankName?: string;

    /**
     * The Business Identifier Code (BIC) is the SWIFT address assigned to
     * a bank. The field value is nil in most cases.
     */
    bic?: string;

    /**
     * Country code where the bank is located.
     * A valid value is an ISO two-character country code (e.g. 'NL').
     */
    countryCode?: string;

    /**
     * The International Bank Account Number (IBAN).
     */
    iban?: string;

    /**
     * The name of the bank account holder. If you submit a name with non-Latin
     * characters, we automatically replace some of them with corresponding Latin
     * characters to meet the FATF recommendations. For example:
     * χ12 is converted to ch12.
     * üA is converted to euA.
     * Peter Møller is converted to Peter Mller, because banks don't accept 'ø'.
     * After replacement, the ownerName must have at least three alphanumeric characters
     * (A-Z, a-z, 0-9), and at least one of them must be a valid Latin character
     * (A-Z, a-z). For example:
     * John17 - allowed.
     * J17 - allowed.
     * 171 - not allowed.
     * John-7 - allowed.
     */
    ownerName?: string;

    /**
     * The bank account holder's tax ID.
     */
    taxId?: string;
}

export interface Card {
    /**
     * The card verification code (1-20 characters). Depending on the card brand, it
     * is known also as:
     * CVv3/CVC2 – length: 3 digits
     * CID – length: 4 digits
     */
    cvc?: string;

    /**
     * The card expiry month. Format: 2 digits, zero-padded for single digits. For example:
     * 03 = March
     * 11 = November
     * Required
     */
    expiryMonth: string;

    /**
     * The card expiry year. Format: 4 digits. For example: 2020
     * Required
     */
    expiryYear: string;

    /**
     * The name of the cardholder, as printed on the card.
     * Required
     */
    holderName: string;

    /**
     * The issue number of the card (for some UK debit cards only).
     */
    issueNumber?: string;

    /**
     * The card number (4-19 characters). Do not use any separators. When this value is
     * returned in a response, only the last 4 digits of the card number are returned.
     * Required
     */
    number: string;

    /**
     * The month component of the start date (for some UK debit cards only).
     */
    startNumber?: string;

    /**
     * The year component of the start date (for some UK debit cards only).
     */
    startYear?: string;
}

export interface CardState {
    data: CardDataPaymentMethodState;
    isValid?: boolean;
    valid?: { [key: string]: boolean };
    errors?: CardStateErrors;
}

interface CardDataPaymentMethodState {
    paymentMethod: CardPaymentMethodState;
}

export interface CardStateErrors {
    [key: string]: string;
}

export interface WechatState {
    data: WechatDataPaymentMethodState;
}

export interface CreditCardPlaceHolder {
    encryptedCardNumber?: string;
    encryptedExpiryDate?: string;
    encryptedSecurityCode: string;
}

interface AccountDataPaymentMethodState {
    paymentMethod: AdyenPaymentMethodState;
}

export interface AccountState {
    data: AccountDataPaymentMethodState;
}

export interface CssProperties {
    background?: string;
    caretColor?: string;
    color?: string;
    display?: string;
    font?: string;
    fontFamily?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontSmoothing?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontVariantAlternates?: string;
    fontVariantCaps?: string;
    fontVariantEastAsian?: string;
    fontVariantLigatures?: string;
    fontVariantNumeric?: string;
    fontWeight?: string;
    letterSpacing?: string;
    lineHeight?: string;
    mozOsxFontSmoothing?: string;
    mozTransition?: string;
    outline?: string;
    opacity?: string | number;
    padding?: string;
    textAlign?: string;
    textShadow?: string;
    transition?: string;
    webkitFontSmoothing?: string;
    webkitTransition?: string;
}

export interface CustomCardAriaLabel {
    label?: string;
    iframeTitle?: string;
}

export interface CustomCardAriaLabels {
    lang?: string;
    encryptedCardNumber?: CustomCardAriaLabel;
    encryptedExpiryDate?: CustomCardAriaLabel;
    encryptedSecurityCode?: CustomCardAriaLabel;
}

export interface Group {
    /**
     * The name of the group.
     */
    name?: string;

    /**
     * Echo data to be used if the payment method is displayed as part of this group.
     */
    paymentMethodData?: string;

    /**
     * The unique code of the group.
     */
    type?: string;
}

export interface InputDetail {
    /**
     * Configuration parameters for the required input.
     */
    configuration?: object;

    /**
     * Input details can also be provided recursively.
     */
    details?: SubInputDetail[];

    /**
     * In case of a select, the URL from which to query the items.
     */
    itemSearchUrl?: string;

    /**
     * In case of a select, the items to choose from.
     */
    items?: Item[];

    /**
     * The value to provide in the result.
     */
    key?: string;

    /**
     * True if this input value is optional.
     */
    optional?: boolean;

    /**
     * The type of the required input.
     */
    type?: string;

    /**
     * The value can be pre-filled, if available.
     */
    value?: string;
}

export interface Item {
    /**
     * The value to provide in the result.
     */
    id?: string;

    /**
     * The display name.
     */
    name?: string;
}

export interface PaymentMethod {
    /**
     * List of possible brands. For example: visa, mc.
     */
    brands?: string[];

    /**
     * The configuration of the payment method.
     */
    configuration?: object;

    /**
     * All input details to be provided to complete the payment with this payment
     * method.
     */
    details?: InputDetail[];

    /**
     * The group where this payment method belongs to.
     */
    group?: Group;

    /**
     * The displayable name of this payment method.
     */
    name?: string;

    /**
     * Echo data required to send in next calls.
     */
    paymentMethodData?: string;

    /**
     * Indicates whether this payment method supports tokenization or not.
     */
    supportsRecurring?: boolean;

    /**
     * The unique payment method code.
     */
    type?: string;
}

export interface PaymentMethodGroup {
    /**
     * The type to submit for any payment method in this group.
     */
    groupType?: string;

    /**
     * The human-readable name of this group.
     */
    name?: string;

    /**
     * The types of payment methods that belong in this group.
     */
    types?: string[];
}

export interface PaymentMethodsResponse {
    /**
     * Groups of payment methods.
     */
    groups?: PaymentMethodGroup[];

    /**
     * Detailed list of one-click payment methods.
     */
    oneClickPaymentMethods?: RecurringDetail;

    /**
     * Detailed list of payment methods required to generate payment forms.
     */
    paymentMethods?: PaymentMethod[];

    /**
     * List of all stored payment methods.
     */
    storedPaymentMethods?: AdyenStoredPaymentMethod[];
}

export interface RecurringDetail extends PaymentMethod {
    /**
     * The reference that uniquely identifies the recurring detail.
     */
    recurringDetailReference?: string;

    /**
     * Contains information on previously stored payment details.
     */
    storedDetails?: StoredDetails;
}

export interface SepaPlaceHolder {
    ownerName?: string;
    ibanNumber?: string;
}

export interface StoredDetails {
    /**
     * The stored bank account.
     */
    bank?: Bank;

    /**
     * The stored card information.
     */
    card?: Card;

    /**
     * The email associated with stored payment details.
     */
    emailAddress?: string;
}

export interface StyleOptions {
    /**
     * Base styling applied to the iframe. All styling extends from this style.
     */
    base?: CssProperties;

    /**
     * Styling applied when a field fails validation.
     */
    error?: CssProperties;

    /**
     * Styling applied to the field's placeholder values.
     */
    placeholder?: CssProperties;

    /**
     * Styling applied once a field passes validation.
     */
    validated?: CssProperties;
}

export interface SubInputDetail {
    /**
     * Configuration parameters for the required input.
     */
    configuration?: object;

    /**
     * In case of a select, the items to choose from.
     */
    items?: Item[];

    /**
     * The value to provide in the result.
     */
    key?: string;

    /**
     * True if this input is optional to provide.
     */
    optional?: boolean;

    /**
     * The type of the required input.
     */
    type?: string;

    /**
     * The value can be pre-filled, if available.
     */
    value?: string;
}

export interface ThreeDS2ChallengeComponentOptions {
    challengeWindowSize?: string;
    onAdditionalDetails?(state: AdyenAdditionalActionState, component?: AdyenComponent): void;
    onError(error: AdyenError): void;
}

export interface ThreeDS2DeviceFingerprintComponentOptions {
    onAdditionalDetails?(state: AdyenAdditionalActionState, component?: AdyenComponent): void;
    onError(error: AdyenError): void;
}

export interface AdyenV3ValidationState {
    valid: boolean;
    fieldType?: AdyenV3CardFields;
    endDigits?: string;
    encryptedFieldName?: string;
    i18n?: string;
    error?: string;
    errorKey?: string;
}

export enum AdyenV3CardFields {
    CardNumber = 'encryptedCardNumber',
    SecurityCode = 'encryptedSecurityCode',
    ExpiryDate = 'encryptedExpiryDate',
}

export type AdyenV3ComponentState = CardState | WechatState;

export type AdyenComponentOptions =
    | AdyenV3CreditCardComponentOptions
    | AdyenV3IdealComponentOptions
    | AdyenCustomCardComponentOptions;

export function isCardState(param: unknown): param is CardState {
    return (
        (typeof param === 'object' &&
            !!param &&
            typeof (param as CardState).data.paymentMethod.encryptedSecurityCode === 'string') ||
        typeof (param as CardState).data.paymentMethod.encryptedExpiryMonth === 'string'
    );
}

export interface AdyenPaymentMethodInitializationData {
    clientKey?: string;
    environment?: string;
    paymentMethodsResponse?: PaymentMethodsResponse;
}
