const user = JSON.parse(sessionStorage.getItem("user") as string)
console.log(user);

if (user) {
    showAlert_login("user-not-found")
    setTimeout(() => {
        window.location.href = "main.html"
    }, 4000)
}

// COUNT DOWN FOR NO USER
function countdown_login(seconds: number): void {
    const intervalId = setInterval(() => {
        const countdownElement = document.querySelector(".countdown");
        if (countdownElement) {
            countdownElement.innerHTML = ""
            countdownElement.innerHTML = seconds.toString();
        }
        seconds--;
        if (seconds === -1) {
            clearInterval(intervalId);
        }
    }, 1000);
}
// MODAL FOR NO USER
function showAlert_login(className: string) {
    const dom = document.querySelector(`.${className}`) as HTMLDivElement;
    countdown_login(3)
    dom?.classList.add("block")
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        dom?.classList.remove(className, 'block');
        window.location.href = "login.html";
    }, 5000);
}



class FormValidator {
    private static instance: FormValidator;

    private constructor() { }

    public static getInstance(): FormValidator {
        if (!FormValidator.instance) {
            FormValidator.instance = new FormValidator();
        }
        return FormValidator.instance;
    }

    // EMAIL VALIDATION
    public validateEmail(email: string): ValidationResult {
        if (!email || email.trim() === '') {
            return { isValid: false, errorMessage: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, errorMessage: 'Please enter a valid email address' };
        }

        return { isValid: true, errorMessage: '' };
    }

    // PASSWORD VALIDATION FOR LOGIN
    public validateLoginPassword(password: string): ValidationResult {
        if (!password || password.trim() === '') {
            return { isValid: false, errorMessage: 'Password is required' };
        }
        return { isValid: true, errorMessage: '' };
    }

    // PASSWORD VALIDATION FOR SIGNUP WITH STRONGER REQUIREMENTS
    public validateSignupPassword(password: string): ValidationResult {
        if (!password || password.trim() === '') {
            return { isValid: false, errorMessage: 'Password is required' };
        }

        if (password.length < 8) {
            return { isValid: false, errorMessage: 'Password must be at least 8 characters long' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must contain at least one uppercase letter' };
        }

        if (!/[0-9]/.test(password)) {
            return { isValid: false, errorMessage: 'Password must contain at least one number' };
        }

        return { isValid: true, errorMessage: '' };
    }

    // PASSWORD CONFIRMATION VALIDATION
    public validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
        if (!confirmPassword || confirmPassword.trim() === '') {
            return { isValid: false, errorMessage: 'Please confirm your password' };
        }

        if (password !== confirmPassword) {
            return { isValid: false, errorMessage: 'Passwords do not match' };
        }

        return { isValid: true, errorMessage: '' };
    }

    // NAME VALIDATION
    public validateName(name: string, fieldName: string): ValidationResult {
        if (!name || name.trim() === '') {
            return { isValid: false, errorMessage: `${fieldName} is required` };
        }

        if (name.length < 2) {
            return { isValid: false, errorMessage: `${fieldName} must be at least 2 characters long` };
        }

        return { isValid: true, errorMessage: '' };
    }

    // TERMS CHECKBOX VALIDATION
    public validateTermsAgreement(checked: boolean): ValidationResult {
        if (!checked) {
            return { isValid: false, errorMessage: 'You must agree to the Terms of Service and Privacy Policy' };
        }

        return { isValid: true, errorMessage: '' };
    }
}

// FORM HANDLING CLASSES
class FormHandler {
    protected validator: FormValidator;
    constructor() {
        this.validator = FormValidator.getInstance();
    }

    protected showError(elementId: string, message: string): void {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');

            // ADD RED BORDER TO THE INPUT
            const inputId = elementId.replace('-error', '');
            const inputElement = document.getElementById(inputId) as HTMLInputElement;
            if (inputElement) {
                inputElement.classList.add('border-red-500');
                inputElement.classList.remove('border-gray-300');
            }
        }
    }

    protected hideError(elementId: string): void {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');

            // RESET INPUT BORDER
            const inputId = elementId.replace('-error', '');
            const inputElement = document.getElementById(inputId) as HTMLInputElement;
            if (inputElement) {
                inputElement.classList.remove('border-red-500');
                inputElement.classList.add('border-gray-300');
            }
        }
    }

    protected getInputValue(elementId: string): string {
        const element = document.getElementById(elementId) as HTMLInputElement;
        return element ? element.value : '';
    }

    protected getCheckboxValue(elementId: string): boolean {
        const element = document.getElementById(elementId) as HTMLInputElement;
        return element ? element.checked : false;
    }
}

class LoginFormHandler extends FormHandler {
    private emailInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private form: HTMLFormElement;
    private APIInstance: UserApiService;
    constructor() {
        super();
        this.form = document.getElementById('login-form-element') as HTMLFormElement;
        this.emailInput = document.getElementById('login-email') as HTMLInputElement;
        this.passwordInput = document.getElementById('login-password') as HTMLInputElement;
        this.initializeEventListeners();
        this.APIInstance = new UserApiService();
    }

    private initializeEventListeners(): void {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (this.emailInput) {
            this.emailInput.addEventListener('blur', this.validateEmail.bind(this));
            this.emailInput.addEventListener('input', this.validateEmail.bind(this));
        }

        if (this.passwordInput) {
            this.passwordInput.addEventListener('blur', this.validatePassword.bind(this));
            this.passwordInput.addEventListener('input', this.validatePassword.bind(this));
        }
    }

    private validateEmail(): void {
        const email = this.emailInput.value;
        const result = this.validator.validateEmail(email);

        if (!result.isValid) {
            this.showError('login-email-error', result.errorMessage);
        } else {
            this.hideError('login-email-error');
        }
    }
    private validatePassword(): void {
        const password = this.passwordInput.value;
        const result = this.validator.validateLoginPassword(password);
        if (!result.isValid) {
            this.showError('login-password-error', result.errorMessage);
        } else {
            this.hideError('login-password-error');
        }
    }
    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        // PERFORM VALIDATION
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        const emailValidation = this.validator.validateEmail(email);
        const passwordValidation = this.validator.validateLoginPassword(password);
        console.log(email);
        console.log(password);
        // DISPLAY VALIDATION ERRORS IF ANY
        if (!emailValidation.isValid) {
            this.showError('login-email-error', emailValidation.errorMessage);
        } else {
            this.hideError('login-email-error');
        }
        if (!passwordValidation.isValid) {
            this.showError('login-password-error', passwordValidation.errorMessage);
        } else {
            this.hideError('login-password-error');
        }
        // IF ALL VALIDATIONS PASS, PROCEED WITH LOGIN
        if (emailValidation.isValid && passwordValidation.isValid) {
            const API_RESPONSE = await this.APIInstance.GetSingleUser(`email=${encodeURIComponent(this.emailInput.value)}&password=${encodeURIComponent(this.passwordInput.value)}`) as Response[];
            console.log(API_RESPONSE);
            if (API_RESPONSE.length === 0) {
                showToast("toast-error-login")
            }
            else {
                const userData = API_RESPONSE[0];
                const flash_check = true
                console.log(userData);
                window.location.href = "main.html";
                sessionStorage.setItem("user", JSON.stringify(userData));
                sessionStorage.setItem("flash_flag", JSON.stringify(flash_check))
                // FlashMessage.success('Logged In Successfully', { type: 'success', timeout: 2000 });
            }
        }
    }
}

class SignupFormHandler extends FormHandler {
    private firstNameInput: HTMLInputElement;
    private lastNameInput: HTMLInputElement;
    private emailInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private confirmPasswordInput: HTMLInputElement;
    private termsCheckbox: HTMLInputElement;
    private form: HTMLFormElement;
    private APIInstance: UserApiService;
    constructor() {
        super();
        this.form = document.getElementById('signup-form-element') as HTMLFormElement;
        this.firstNameInput = document.getElementById('first-name') as HTMLInputElement;
        this.lastNameInput = document.getElementById('last-name') as HTMLInputElement;
        this.emailInput = document.getElementById('signup-email') as HTMLInputElement;
        this.passwordInput = document.getElementById('signup-password') as HTMLInputElement;
        this.confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
        this.termsCheckbox = document.getElementById('terms') as HTMLInputElement;
        this.initializeEventListeners();
        this.APIInstance = new UserApiService();
    }

    private initializeEventListeners(): void {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (this.firstNameInput) {
            this.firstNameInput.addEventListener('blur', this.validateFirstName.bind(this));
            this.firstNameInput.addEventListener('input', this.validateFirstName.bind(this));
        }

        if (this.lastNameInput) {
            this.lastNameInput.addEventListener('blur', this.validateLastName.bind(this));
            this.lastNameInput.addEventListener('input', this.validateLastName.bind(this));
        }

        if (this.emailInput) {
            this.emailInput.addEventListener('blur', this.validateEmail.bind(this));
            this.emailInput.addEventListener('input', this.validateEmail.bind(this));
        }

        if (this.passwordInput) {
            this.passwordInput.addEventListener('blur', this.validatePassword.bind(this));
            this.passwordInput.addEventListener('input', () => {
                this.validatePassword();
                // RE-VALIDATE CONFIRM PASSWORD WHEN PASSWORD CHANGES
                if (this.confirmPasswordInput.value) {
                    this.validateConfirmPassword();
                }
            });
        }

        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('blur', this.validateConfirmPassword.bind(this));
            this.confirmPasswordInput.addEventListener('input', this.validateConfirmPassword.bind(this));
        }

        if (this.termsCheckbox) {
            this.termsCheckbox.addEventListener('change', this.validateTerms.bind(this));
        }
    }

    private validateFirstName(): void {
        const firstName = this.firstNameInput.value;
        const result = this.validator.validateName(firstName, 'First Name');

        if (!result.isValid) {
            this.showError('first-name-error', result.errorMessage);
        } else {
            this.hideError('first-name-error');
        }
    }

    private validateLastName(): void {
        const lastName = this.lastNameInput.value;
        const result = this.validator.validateName(lastName, 'Last Name');

        if (!result.isValid) {
            this.showError('last-name-error', result.errorMessage);
        } else {
            this.hideError('last-name-error');
        }
    }

    private validateEmail(): void {
        const email = this.emailInput.value;
        const result = this.validator.validateEmail(email);

        if (!result.isValid) {
            this.showError('signup-email-error', result.errorMessage);
        } else {
            this.hideError('signup-email-error');
        }
    }

    private validatePassword(): void {
        const password = this.passwordInput.value;
        const result = this.validator.validateSignupPassword(password);

        if (!result.isValid) {
            this.showError('signup-password-error', result.errorMessage);
        } else {
            this.hideError('signup-password-error');
        }
    }

    private validateConfirmPassword(): void {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const result = this.validator.validateConfirmPassword(password, confirmPassword);

        if (!result.isValid) {
            this.showError('confirm-password-error', result.errorMessage);
        } else {
            this.hideError('confirm-password-error');
        }
    }

    private validateTerms(): void {
        const termsChecked = this.termsCheckbox.checked;
        const result = this.validator.validateTermsAgreement(termsChecked);

        if (!result.isValid) {
            this.showError('terms-error', result.errorMessage);
        } else {
            this.hideError('terms-error');
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        // PERFORM VALIDATION
        const firstName = this.firstNameInput.value;
        const lastName = this.lastNameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const termsChecked = this.termsCheckbox.checked;

        const firstNameValidation = this.validator.validateName(firstName, 'First Name');
        const lastNameValidation = this.validator.validateName(lastName, 'Last Name');
        const emailValidation = this.validator.validateEmail(email);
        const passwordValidation = this.validator.validateSignupPassword(password);
        const confirmPasswordValidation = this.validator.validateConfirmPassword(password, confirmPassword);
        const termsValidation = this.validator.validateTermsAgreement(termsChecked);

        // DISPLAY VALIDATION ERRORS IF ANY
        if (!firstNameValidation.isValid) {
            this.showError('first-name-error', firstNameValidation.errorMessage);
        }

        if (!lastNameValidation.isValid) {
            this.showError('last-name-error', lastNameValidation.errorMessage);
        }

        if (!emailValidation.isValid) {
            this.showError('signup-email-error', emailValidation.errorMessage);
        }

        if (!passwordValidation.isValid) {
            this.showError('signup-password-error', passwordValidation.errorMessage);
        }

        if (!confirmPasswordValidation.isValid) {
            this.showError('confirm-password-error', confirmPasswordValidation.errorMessage);
        }

        if (!termsValidation.isValid) {
            this.showError('terms-error', termsValidation.errorMessage);
        }
        if (email.length) {
            const findemail: Object[] | undefined = await this.APIInstance.GetSingleUser(`email=${email.trim()}`)
            console.log(findemail?.length);
            console.log(findemail);
            if (findemail?.length === 0) {
                if (
                    firstNameValidation.isValid &&
                    lastNameValidation.isValid &&
                    emailValidation.isValid &&
                    passwordValidation.isValid &&
                    confirmPasswordValidation.isValid &&
                    termsValidation.isValid
                ) {
                    const user: User = {
                        id: Date.now().toString(),
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password,
                    };
                    this.APIInstance.PostUser(user, "users");
                }
            } else {
                showToast("toast-error-register")
                debugger;
            }
        }
    }
}
// TAB SWITCHING FUNCTIONALITY
class TabSwitcher {
    private loginTab: HTMLElement;
    private signupTab: HTMLElement;
    private loginForm: HTMLElement;
    private signupForm: HTMLElement;

    constructor() {
        this.loginTab = document.getElementById('login-tab') as HTMLElement;
        this.signupTab = document.getElementById('signup-tab') as HTMLElement;
        this.loginForm = document.getElementById('login-form') as HTMLElement;
        this.signupForm = document.getElementById('signup-form') as HTMLElement;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        if (this.loginTab) {
            this.loginTab.addEventListener('click', this.showLoginForm.bind(this));
        }

        if (this.signupTab) {
            this.signupTab.addEventListener('click', this.showSignupForm.bind(this));
        }
    }

    private showLoginForm(): void {
        this.loginTab.className = 'w-1/2 py-3 font-medium text-center text-blue-600 border-b-2 border-blue-600 bg-white';
        this.signupTab.className = 'w-1/2 py-3 font-medium text-center text-gray-500 border-b border-gray-200 bg-gray-50';
        this.loginForm.classList.remove('hidden');
        this.signupForm.classList.add('hidden');
    }

    private showSignupForm(): void {
        this.signupTab.className = 'w-1/2 py-3 font-medium text-center text-blue-600 border-b-2 border-blue-600 bg-white';
        this.loginTab.className = 'w-1/2 py-3 font-medium text-center text-gray-500 border-b border-gray-200 bg-gray-50';
        this.signupForm.classList.remove('hidden');
        this.loginForm.classList.add('hidden');
    }
}

// INITIALIZE THE APPLICATION
document.addEventListener('DOMContentLoaded', () => {
    new TabSwitcher();
    new LoginFormHandler();
    new SignupFormHandler();
});

function showToast(id: string) {
    debugger
    const dom = document.getElementById(id) as HTMLDivElement;
    dom?.classList.remove("hidden")
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        dom?.classList.add(id, 'hidden');
    }, 3000);
}