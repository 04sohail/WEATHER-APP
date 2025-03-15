// User profile modal toggle
const userProfile: HTMLElement | null = document.getElementById('user-profile');
const profileModal: HTMLElement | null = document.getElementById('profile-modal');

userProfile?.addEventListener('click', () => {
    if (profileModal) {
        profileModal.classList.toggle('hidden');
    }
});

// Close modal if clicked outside
document.addEventListener('click', (event: MouseEvent) => {
    if (profileModal && !profileModal.contains(event.target as Node) && event.target !== userProfile) {
        profileModal.classList.add('hidden');
    }
});