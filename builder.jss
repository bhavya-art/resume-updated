/* 
==============================================
RESUMIX BUILDER FUNCTIONALITY
==============================================
Handles form management, live preview, PDF generation,
and template switching
==============================================
*/

// Global variables
let currentTemplate = 'modern';
let currentColor = '#223030';
let experienceCount = 0;
let educationCount = 0;
let skills = [];
let zoomLevel = 100;
let photoDataURL = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeBuilder();
    loadFromURL();
    loadSavedData();
    setupEventListeners();
    setupAutoSave();
});

/* 
==============================================
INITIALIZATION
==============================================
*/

function initializeBuilder() {
    console.log('🔧 Initializing Resume Builder');
    
    // Add initial experience and education entries
    addExperience();
    addEducation();
    
    // Set up template
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
        currentTemplate = templateParam;
        document.getElementById('templateSelect').value = templateParam;
    }
    
    // Initial preview update
    updatePreview();
    updateProgressIndicator();
}

function loadFromURL() {
    // Get template from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    
    if (template) {
        currentTemplate = template;
        document.getElementById('templateSelect').value = template;
        changeTemplate();
    }
}

function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S or Cmd+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveResume();
        }
        
        // Ctrl+P or Cmd+P to download
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            downloadResume();
        }
    });
    
    // Form validation
    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
        saveResumeData();
        console.log('📀 Auto-saved resume data');
    }, 30000);
    
    // Save on input changes (debounced)
    let saveTimeout;
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, textarea, select')) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveResumeData();
            }, 2000);
        }
    });
}

/* 
==============================================
TEMPLATE MANAGEMENT
==============================================
*/

function changeTemplate() {
    const templateSelect = document.getElementById('templateSelect');
    currentTemplate = templateSelect.value;
    updatePreview();
    
    // Track template change
    console.log(`📋 Template changed to: ${currentTemplate}`);
}

function generateTemplateHTML(data) {
    const templates = {
        modern: generateModernTemplate,
        executive: generateExecutiveTemplate,
        creative: generateCreativeTemplate,
        minimal: generateMinimalTemplate
    };
    
    const generator = templates[currentTemplate] || templates.modern;
    return generator(data);
}

function generateModernTemplate(data) {
    return `
        <div class="resume-modern" style="--primary-color: ${currentColor}">
            <div class="resume-header">
                ${photoDataURL ? `<div class="resume-photo"><img src="${photoDataURL}" alt="Profile Photo"></div>` : ''}
                <div class="resume-info">
                    <h1 class="resume-name">${data.fullName || 'Your Name'}</h1>
                    <h2 class="resume-title">${data.jobTitle || 'Your Professional Title'}</h2>
                    <div class="resume-contact">
                        ${data.email ? `<span>📧 ${data.email}</span>` : ''}
                        ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
                        ${data.location ? `<span>📍 ${data.location}</span>` : ''}
                        ${data.linkedin ? `<span>💼 ${data.linkedin}</span>` : ''}
                    </div>
                </div>
            </div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p>${data.summary}</p>
                </div>
            ` : ''}
            
            ${generateExperienceSection(data.experience)}
            ${generateEducationSection(data.education)}
            ${generateSkillsSection(data.skills)}
        </div>
    `;
}

function generateExecutiveTemplate(data) {
    return `
        <div class="resume-executive" style="--primary-color: ${currentColor}">
            <div class="resume-header centered">
                <h1 class="resume-name">${data.fullName || 'Your Name'}</h1>
                <h2 class="resume-title">${data.jobTitle || 'Your Professional Title'}</h2>
                <div class="resume-contact-line">
                    ${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}
                </div>
                ${data.linkedin ? `<div class="linkedin-line">${data.linkedin}</div>` : ''}
            </div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h3>Executive Summary</h3>
                    <p>${data.summary}</p>
                </div>
            ` : ''}
            
            ${generateExperienceSection(data.experience)}
            ${generateEducationSection(data.education)}
            ${generateSkillsSection(data.skills)}
        </div>
    `;
}

function generateCreativeTemplate(data) {
    return `
        <div class="resume-creative" style="--primary-color: ${currentColor}">
            <div class="resume-sidebar">
                ${photoDataURL ? `<div class="sidebar-photo"><img src="${photoDataURL}" alt="Profile Photo"></div>` : ''}
                
                <div class="sidebar-section">
                    <h3>Contact</h3>
                    <div class="contact-list">
                        ${data.email ? `<div class="contact-item">📧 ${data.email}</div>` : ''}
                        ${data.phone ? `<div class="contact-item">📱 ${data.phone}</div>` : ''}
                        ${data.location ? `<div class="contact-item">📍 ${data.location}</div>` : ''}
                        ${data.linkedin ? `<div class="contact-item">💼 LinkedIn</div>` : ''}
                    </div>
                </div>
                
                ${generateSkillsSidebar(data.skills)}
            </div>
            
            <div class="resume-main">
                <div class="main-header">
                    <h1 class="resume-name">${data.fullName || 'Your Name'}</h1>
                    <h2 class="resume-title">${data.jobTitle || 'Your Professional Title'}</h2>
                </div>
                
                ${data.summary ? `
                    <div class="resume-section">
                        <h3>About Me</h3>
                        <p>${data.summary}</p>
                    </div>
                ` : ''}
                
                ${generateExperienceSection(data.experience)}
                ${generateEducationSection(data.education)}
            </div>
        </div>
    `;
}

function generateMinimalTemplate(data) {
    return `
        <div class="resume-minimal" style="--primary-color: ${currentColor}">
            <div class="resume-header">
                <h1 class="resume-name">${data.fullName || 'Your Name'}</h1>
                <h2 class="resume-title">${data.jobTitle || 'Your Professional Title'}</h2>
                <div class="resume-contact">
                    ${[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(' • ')}
                </div>
            </div>
            
            <div class="divider"></div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h3>Summary</h3>
                    <p>${data.summary}</p>
                </div>
            ` : ''}
            
            ${generateExperienceSection(data.experience)}
            ${generateEducationSection(data.education)}
            ${generateSkillsSection(data.skills)}
        </div>
    `;
}

/* 
==============================================
SECTION GENERATORS
==============================================
*/

function generateExperienceSection(experiences) {
    if (!experiences || experiences.length === 0) return '';
    
    return `
        <div class="resume-section">
            <h3>Professional Experience</h3>
            ${experiences.map(exp => `
                <div class="experience-item">
                    <div class="item-header">
                        <h4 class="item-title">${exp.title || 'Job Title'}</h4>
                        <span class="item-date">${exp.duration || 'Duration'}</span>
                    </div>
                    <div class="item-subtitle">${exp.company || 'Company Name'}</div>
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function generateEducationSection(education) {
    if (!education || education.length === 0) return '';
    
    return `
        <div class="resume-section">
            <h3>Education</h3>
            ${education.map(edu => `
                <div class="education-item">
                    <div class="item-header">
                        <h4 class="item-title">${edu.degree || 'Degree'}</h4>
                        <span class="item-date">${edu.year || 'Year'}</span>
                    </div>
                    <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                    ${edu.gpa ? `<div class="item-description">${edu.gpa}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function generateSkillsSection(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="resume-section">
            <h3>Skills</h3>
            <div class="skills-container">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;
}

function generateSkillsSidebar(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="sidebar-section">
            <h3>Skills</h3>
            <div class="skills-list">
                ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
        </div>
    `;
}

/* 
==============================================
FORM MANAGEMENT
==============================================
*/

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'dynamic-item';
    experienceDiv.id = `experience-${experienceCount}`;
    
    experienceDiv.innerHTML = `
        <div class="item-header">
            <h4>Experience ${experienceCount}</h4>
            <button type="button" class="remove-btn" onclick="removeExperience(${experienceCount})">Remove</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" id="exp-title-${experienceCount}" placeholder="e.g. Software Developer" oninput="updatePreview()" required>
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" id="exp-company-${experienceCount}" placeholder="e.g. Tech Corp Inc." oninput="updatePreview()" required>
            </div>
        </div>
        <div class="form-group">
            <label>Duration *</label>
            <input type="text" id="exp-duration-${experienceCount}" placeholder="e.g. Jan 2020 - Present" oninput="updatePreview()" required>
        </div>
        <div class="form-group">
            <label>Job Description</label>
            <textarea id="exp-description-${experienceCount}" placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Focus on quantifiable results when possible" rows="4" oninput="updatePreview()"></textarea>
            <small class="form-hint">Use bullet points (•) and focus on achievements with numbers when possible</small>
        </div>
    `;
    
    container.appendChild(experienceDiv);
    updatePreview();
    updateProgressIndicator();
}

function removeExperience(id) {
    const element = document.getElementById(`experience-${id}`);
    if (element) {
        element.remove();
        updatePreview();
        updateProgressIndicator();
    }
}

function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    
    const educationDiv = document.createElement('div');
    educationDiv.className = 'dynamic-item';
    educationDiv.id = `education-${educationCount}`;
    
    educationDiv.innerHTML = `
        <div class="item-header">
            <h4>Education ${educationCount}</h4>
            <button type="button" class="remove-btn" onclick="removeEducation(${educationCount})">Remove</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" id="edu-degree-${educationCount}" placeholder="e.g. Bachelor of Science" oninput="updatePreview()" required>
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" id="edu-field-${educationCount}" placeholder="e.g. Computer Science" oninput="updatePreview()">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Institution *</label>
                <input type="text" id="edu-institution-${educationCount}" placeholder="e.g. University of Technology" oninput="updatePreview()" required>
            </div>
            <div class="form-group">
                <label>Year *</label>
                <input type="text" id="edu-year-${educationCount}" placeholder="e.g. 2018-2022" oninput="updatePreview()" required>
            </div>
        </div>
        <div class="form-group">
            <label>Additional Information</label>
            <input type="text" id="edu-gpa-${educationCount}" placeholder="e.g. GPA: 3.8/4.0, Magna Cum Laude" oninput="updatePreview()">
        </div>
    `;
    
    container.appendChild(educationDiv);
    updatePreview();
    updateProgressIndicator();
}

function removeEducation(id) {
    const element = document.getElementById(`education-${id}`);
    if (element) {
        element.remove();
        updatePreview();
        updateProgressIndicator();
    }
}

/* 
==============================================
SKILLS MANAGEMENT
==============================================
*/

function addSkillOnEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkillFromInput();
    }
}

function addSkillFromInput() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();
    
    if (skill && !skills.includes(skill)) {
        addSkill(skill);
        input.value = '';
    }
}

function addSkill(skillName) {
    if (!skills.includes(skillName)) {
        skills.push(skillName);
        updateSkillsList();
        updatePreview();
        updateProgressIndicator();
    }
}

function updateSkillsList() {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';
    
    skills.forEach((skill, index) => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-item';
        skillDiv.innerHTML = `
            <span class="skill-name">${skill}</span>
            <button type="button" class="skill-remove" onclick="removeSkill(${index})" title="Remove skill">×</button>
        `;
        container.appendChild(skillDiv);
    });
}

function removeSkill(index) {
    skills.splice(index, 1);
    updateSkillsList();
    updatePreview();
    updateProgressIndicator();
}

/* 
==============================================
PHOTO UPLOAD
==============================================
*/

function handlePhotoUpload() {
    const fileInput = document.getElementById('photoUpload');
    const file = fileInput.files[0];
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            photoDataURL = e.target.result;
            
            // Show preview
            const preview = document.getElementById('photoPreview');
            const img = document.getElementById('photoImg');
            
            img.src = photoDataURL;
            preview.style.display = 'block';
            
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    photoDataURL = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoUpload').value = '';
    updatePreview();
}

/* 
==============================================
COLOR CUSTOMIZATION
==============================================
*/

function changeColor(color) {
    currentColor = color;
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Update color picker selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('active');
    
    updatePreview();
}

/* 
==============================================
PREVIEW UPDATE
==============================================
*/

function updatePreview() {
    const data = collectFormData();
    const html = generateTemplateHTML(data);
    document.getElementById('resumeContent').innerHTML = html;
}

function collectFormData() {
    // Personal information
    const personalData = {
        fullName: document.getElementById('fullName')?.value || '',
        jobTitle: document.getElementById('jobTitle')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        location: document.getElementById('location')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        summary: document.getElementById('summary')?.value || ''
    };
    
    // Experience data
    const experience = [];
    for (let i = 1; i <= experienceCount; i++) {
        const title = document.getElementById(`exp-title-${i}`)?.value;
        const company = document.getElementById(`exp-company-${i}`)?.value;
        const duration = document.getElementById(`exp-duration-${i}`)?.value;
        const description = document.getElementById(`exp-description-${i}`)?.value;
        
        if (title || company || duration || description) {
            experience.push({ title, company, duration, description });
        }
    }
    
    // Education data
    const education = [];
    for (let i = 1; i <= educationCount; i++) {
        const degree = document.getElementById(`edu-degree-${i}`)?.value;
        const field = document.getElementById(`edu-field-${i}`)?.value;
        const institution = document.getElementById(`edu-institution-${i}`)?.value;
        const year = document.getElementById(`edu-year-${i}`)?.value;
        const gpa = document.getElementById(`edu-gpa-${i}`)?.value;
        
        if (degree || institution || year) {
            const fullDegree = field ? `${degree} in ${field}` : degree;
            education.push({ degree: fullDegree, institution, year, gpa });
        }
    }
    
    return {
        ...personalData,
        experience,
        education,
        skills
    };
}

/* 
==============================================
ZOOM FUNCTIONALITY
==============================================
*/

function adjustZoom(delta) {
    zoomLevel = Math.max(50, Math.min(200, zoomLevel + delta));
    
    const previewArea = document.getElementById('previewArea');
    const zoomDisplay = document.getElementById('zoomLevel');
    
    previewArea.style.transform = `scale(${zoomLevel / 100})`;
    zoomDisplay.textContent = `${zoomLevel}%`;
}

/* 
==============================================
PROGRESS INDICATOR
==============================================
*/

function updateProgressIndicator() {
    const steps = document.querySelectorAll('.progress-step');
    const data = collectFormData();
    
    // Step 1: Personal Info
    const hasPersonalInfo = data.fullName && data.email && data.phone;
    steps[0].classList.toggle('completed', hasPersonalInfo);
    
    // Step 2: Experience
    const hasExperience = data.experience && data.experience.length > 0;
    steps[1].classList.toggle('completed', hasExperience);
    
    // Step 3: Education
    const hasEducation = data.education && data.education.length > 0;
    steps[2].classList.toggle('completed', hasEducation);
    
    // Step 4: Skills
    const hasSkills = data.skills && data.skills.length > 0;
    steps[3].classList.toggle('completed', hasSkills);
    
    // Step 5: Ready to download
    const isComplete = hasPersonalInfo && hasExperience && hasEducation && hasSkills;
    steps[4].classList.toggle('completed', isComplete);
}

/* 
==============================================
FORM VALIDATION
==============================================
*/

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate required fields
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate email format
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Validate phone format
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/* 
==============================================
DATA PERSISTENCE
==============================================
*/

function saveResumeData() {
    const resumeData = {
        template: currentTemplate,
        color: currentColor,
        personal: {
            fullName: document.getElementById('fullName')?.value || '',
            jobTitle: document.getElementById('jobTitle')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            summary: document.getElementById('summary')?.value || ''
        },
        experience: [],
        education: [],
        skills: skills,
        photo: photoDataURL,
        timestamp: new Date().toISOString()
    };
    
    // Collect experience data
    for (let i = 1; i <= experienceCount; i++) {
        const exp = {
            title: document.getElementById(`exp-title-${i}`)?.value || '',
            company: document.getElementById(`exp-company-${i}`)?.value || '',
            duration: document.getElementById(`exp-duration-${i}`)?.value || '',
            description: document.getElementById(`exp-description-${i}`)?.value || ''
        };
        if (exp.title || exp.company || exp.duration || exp.description) {
            resumeData.experience.push(exp);
        }
    }
    
    // Collect education data
    for (let i = 1; i <= educationCount; i++) {
        const edu = {
            degree: document.getElementById(`edu-degree-${i}`)?.value || '',
            field: document.getElementById(`edu-field-${i}`)?.value || '',
            institution: document.getElementById(`edu-institution-${i}`)?.value || '',
            year: document.getElementById(`edu-year-${i}`)?.value || '',
            gpa: document.getElementById(`edu-gpa-${i}`)?.value || ''
        };
        if (edu.degree || edu.institution || edu.year) {
            resumeData.education.push(edu);
        }
    }
    
    try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        return true;
    } catch (error) {
        console.error('Failed to save resume data:', error);
        return false;
    }
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('resumeData');
        if (!saved) return;
        
        const resumeData = JSON.parse(saved);
        
        // Load template and color
        if (resumeData.template) {
            currentTemplate = resumeData.template;
            document.getElementById('templateSelect').value = resumeData.template;
        }
        
        if (resumeData.color) {
            changeColor(resumeData.color);
        }
        
        // Load personal data
        if (resumeData.personal) {
            Object.keys(resumeData.personal).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = resumeData.personal[key] || '';
                }
            });
        }
        
        // Load photo
        if (resumeData.photo) {
            photoDataURL = resumeData.photo;
            const preview = document.getElementById('photoPreview');
            const img = document.getElementById('photoImg');
            img.src = photoDataURL;
            preview.style.display = 'block';
        }
        
        // Load skills
        skills = resumeData.skills || [];
        updateSkillsList();
        
        // Load experience (after clearing existing)
        document.getElementById('experienceContainer').innerHTML = '';
        experienceCount = 0;
        if (resumeData.experience) {
            resumeData.experience.forEach((exp, index) => {
                addExperience();
                document.getElementById(`exp-title-${experienceCount}`).value = exp.title || '';
                document.getElementById(`exp-company-${experienceCount}`).value = exp.company || '';
                document.getElementById(`exp-duration-${experienceCount}`).value = exp.duration || '';
                document.getElementById(`exp-description-${experienceCount}`).value = exp.description || '';
            });
        }
        
        // Load education (after clearing existing)
        document.getElementById('educationContainer').innerHTML = '';
        educationCount = 0;
        if (resumeData.education) {
            resumeData.education.forEach((edu, index) => {
                addEducation();
                document.getElementById(`edu-degree-${educationCount}`).value = edu.degree || '';
                document.getElementById(`edu-field-${educationCount}`).value = edu.field || '';
                document.getElementById(`edu-institution-${educationCount}`).value = edu.institution || '';
                document.getElementById(`edu-year-${educationCount}`).value = edu.year || '';
                document.getElementById(`edu-gpa-${educationCount}`).value = edu.gpa || '';
            });
        }
        
        updatePreview();
        updateProgressIndicator();
        
        console.log('📋 Loaded saved resume data');
        
    } catch (error) {
        console.error('Failed to load saved data:', error);
    }
}

/* 
==============================================
SAVE AND DOWNLOAD FUNCTIONS
==============================================
*/

function saveResume() {
    const success = saveResumeData();
    
    if (success) {
        showSuccessModal();
        showToast('💾 Resume saved successfully!', 3000);
    } else {
        showToast('❌ Failed to save resume. Please try again.', 3000);
    }
}

async function downloadResume() {
    try {
        const { jsPDF } = window.jspdf;
        const resumeElement = document.getElementById('resumePreview');
        
        // Show loading state
        const downloadBtn = document.querySelector('.download-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '⏳ Generating PDF...';
        downloadBtn.disabled = true;
        
        // Save current data before download
        saveResumeData();
        
        // Configure html2canvas options for better quality
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: resumeElement.scrollWidth,
            height: resumeElement.scrollHeight,
            onclone: function(clonedDoc) {
                // Ensure all styles are applied to cloned document
                const clonedElement = clonedDoc.getElementById('resumePreview');
                if (clonedElement) {
                    clonedElement.style.transform = 'scale(1)';
                    clonedElement.style.zoom = '1';
                }
            }
        });
        
        // Create PDF with proper dimensions
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions to fit A4 properly
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate ratio to fit page
        const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
        const imgX = (pdfWidth - imgWidth * 0.264583 * ratio) / 2;
        const imgY = 10; // Small margin from top
        
        pdf.addImage(
            imgData, 
            'PNG', 
            imgX, 
            imgY, 
            imgWidth * 0.264583 * ratio, 
            imgHeight * 0.264583 * ratio
        );
        
        // Generate filename based on name and date
        const name = document.getElementById('fullName')?.value || 'Resume';
        const date = new Date().toISOString().split('T')[0];
        const filename = `${name.replace(/\s+/g, '_')}_Resume_${date}.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        // Track download
        console.log(`📥 Downloaded: ${filename}`);
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        // Show success message
        showToast('🎉 Resume downloaded successfully!', 3000);
        
        // Update progress
        updateProgressIndicator();
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('❌ Error generating PDF. Please try again.', 3000);
        
        // Reset button on error
        const downloadBtn = document.querySelector('.download-btn');
        downloadBtn.innerHTML = '📥 Download PDF';
        downloadBtn.disabled = false;
    }
}

/* 
==============================================
UI HELPER FUNCTIONS
==============================================
*/

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    
    // Add animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #223030;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInToast 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInToast {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutToast {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, duration);
}

/* 
==============================================
EXPORT/IMPORT FUNCTIONALITY
==============================================
*/

function exportResumeData() {
    const data = {
        version: '1.0',
        exported: new Date().toISOString(),
        resumeData: JSON.parse(localStorage.getItem('resumeData') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('📤 Resume data exported successfully!', 3000);
}

function importResumeData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.resumeData) {
                    localStorage.setItem('resumeData', JSON.stringify(imported.resumeData));
                    location.reload(); // Reload to apply imported data
                } else {
                    showToast('❌ Invalid resume data file', 3000);
                }
            } catch (error) {
                showToast('❌ Error importing resume data', 3000);
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/* 
==============================================
UTILITY FUNCTIONS
==============================================
*/

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to preview updates
const debouncedUpdatePreview = debounce(updatePreview, 300);

// Replace direct updatePreview calls with debounced version for input events
document.addEventListener('input', function(e) {
    if (e.target.matches('input, textarea, select')) {
        debouncedUpdatePreview();
    }
});

console.log('🚀 Resume Builder Initialized Successfully!');