// Global variables
let currentColor = '#223030';
let experienceCount = 0;
let educationCount = 0;
let skills = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    handleScrollAnimations();
    initializeBuilder();
});

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Template selection
function selectTemplate(templateType) {
    localStorage.setItem('selectedTemplate', templateType);
    goToBuilder();
}

// Navigate to resume builder
function goToBuilder() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('builderPage').style.display = 'block';
    
    // Initialize the builder with default data
    if (experienceCount === 0) {
        addExperience();
    }
    if (educationCount === 0) {
        addEducation();
    }
}

// Go back to home page
function goBackHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('builderPage').style.display = 'none';
}

// Initialize builder functionality
function initializeBuilder() {
    // Set up color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Add experience entry
function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'dynamic-item';
    experienceDiv.id = `experience-${experienceCount}`;
    
    experienceDiv.innerHTML = `
        <div class="item-header">
            <div class="item-number">Experience ${experienceCount}</div>
            <button class="remove-btn" onclick="removeExperience(${experienceCount})">Remove</button>
        </div>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" id="exp-title-${experienceCount}" placeholder="e.g. Software Developer" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" id="exp-company-${experienceCount}" placeholder="e.g. Tech Corp" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" id="exp-duration-${experienceCount}" placeholder="e.g. Jan 2020 - Present" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="exp-description-${experienceCount}" placeholder="Describe your key responsibilities and achievements" oninput="updatePreview()"></textarea>
        </div>
    `;
    
    container.appendChild(experienceDiv);
    updatePreview();
}

// Remove experience entry
function removeExperience(id) {
    const element = document.getElementById(`experience-${id}`);
    if (element) {
        element.remove();
        updatePreview();
    }
}

// Add education entry
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    
    const educationDiv = document.createElement('div');
    educationDiv.className = 'dynamic-item';
    educationDiv.id = `education-${educationCount}`;
    
    educationDiv.innerHTML = `
        <div class="item-header">
            <div class="item-number">Education ${educationCount}</div>
            <button class="remove-btn" onclick="removeEducation(${educationCount})">Remove</button>
        </div>
        <div class="form-group">
            <label>Degree</label>
            <input type="text" id="edu-degree-${educationCount}" placeholder="e.g. Bachelor of Science" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>Institution</label>
            <input type="text" id="edu-institution-${educationCount}" placeholder="e.g. University of Technology" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" id="edu-year-${educationCount}" placeholder="e.g. 2018-2022" oninput="updatePreview()">
        </div>
        <div class="form-group">
            <label>GPA / Additional Info (Optional)</label>
            <input type="text" id="edu-gpa-${educationCount}" placeholder="e.g. GPA: 3.8/4.0" oninput="updatePreview()">
        </div>
    `;
    
    container.appendChild(educationDiv);
    updatePreview();
}

// Remove education entry
function removeEducation(id) {
    const element = document.getElementById(`education-${id}`);
    if (element) {
        element.remove();
        updatePreview();
    }
}

// Add skill
function addSkill(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = document.getElementById('skillInput');
        const skill = input.value.trim();
        
        if (skill && !skills.includes(skill)) {
            skills.push(skill);
            input.value = '';
            updateSkillsList();
            updatePreview();
        }
    }
}

// Update skills list display
function updateSkillsList() {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';
    
    skills.forEach((skill, index) => {
        const skillDiv = document.createElement('div');
        skillDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 8px 12px; border-radius: 5px; margin-bottom: 5px;';
        skillDiv.innerHTML = `
            <span>${skill}</span>
            <button class="remove-btn" onclick="removeSkill(${index})" style="margin-left: 10px;">×</button>
        `;
        container.appendChild(skillDiv);
    });
}

// Remove skill
function removeSkill(index) {
    skills.splice(index, 1);
    updateSkillsList();
    updatePreview();
}

// Change template color
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

// Update resume preview
function updatePreview() {
    // Personal Information
    const name = document.getElementById('fullName')?.value || 'Your Name';
    const email = document.getElementById('email')?.value || 'your.email@example.com';
    const phone = document.getElementById('phone')?.value || '+1 (555) 123-4567';
    const address = document.getElementById('address')?.value || 'City, State';
    const summary = document.getElementById('summary')?.value || '';

    // Update header
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewEmail').textContent = email;
    document.getElementById('previewPhone').textContent = phone;
    document.getElementById('previewAddress').textContent = address;

    // Update summary
    const summarySection = document.getElementById('summarySection');
    const previewSummary = document.getElementById('previewSummary');
    if (summary.trim()) {
        summarySection.style.display = 'block';
        previewSummary.textContent = summary;
    } else {
        summarySection.style.display = 'none';
    }

    // Update experience
    updateExperiencePreview();
    
    // Update education
    updateEducationPreview();
    
    // Update skills
    updateSkillsPreview();
}

// Update experience preview
function updateExperiencePreview() {
    const container = document.getElementById('previewExperience');
    const section = document.getElementById('experienceSection');
    container.innerHTML = '';
    
    let hasExperience = false;
    
    for (let i = 1; i <= experienceCount; i++) {
        const title = document.getElementById(`exp-title-${i}`)?.value;
        const company = document.getElementById(`exp-company-${i}`)?.value;
        const duration = document.getElementById(`exp-duration-${i}`)?.value;
        const description = document.getElementById(`exp-description-${i}`)?.value;
        
        if (title || company || duration || description) {
            hasExperience = true;
            const expDiv = document.createElement('div');
            expDiv.className = 'experience-item';
            expDiv.innerHTML = `
                <div class="item-title">${title || 'Job Title'}</div>
                <div class="item-subtitle">${company || 'Company'} ${duration ? '| ' + duration : ''}</div>
                <div class="item-description">${description || ''}</div>
            `;
            container.appendChild(expDiv);
        }
    }
    
    section.style.display = hasExperience ? 'block' : 'none';
}

// Update education preview
function updateEducationPreview() {
    const container = document.getElementById('previewEducation');
    const section = document.getElementById('educationSection');
    container.innerHTML = '';
    
    let hasEducation = false;
    
    for (let i = 1; i <= educationCount; i++) {
        const degree = document.getElementById(`edu-degree-${i}`)?.value;
        const institution = document.getElementById(`edu-institution-${i}`)?.value;
        const year = document.getElementById(`edu-year-${i}`)?.value;
        const gpa = document.getElementById(`edu-gpa-${i}`)?.value;
        
        if (degree || institution || year) {
            hasEducation = true;
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-item';
            eduDiv.innerHTML = `
                <div class="item-title">${degree || 'Degree'}</div>
                <div class="item-subtitle">${institution || 'Institution'} ${year ? '| ' + year : ''}</div>
                ${gpa ? `<div class="item-description">${gpa}</div>` : ''}
            `;
            container.appendChild(eduDiv);
        }
    }
    
    section.style.display = hasEducation ? 'block' : 'none';
}

// Update skills preview
function updateSkillsPreview() {
    const container = document.getElementById('previewSkills');
    const section = document.getElementById('skillsSection');
    container.innerHTML = '';
    
    if (skills.length > 0) {
        section.style.display = 'block';
        skills.forEach(skill => {
            const skillSpan = document.createElement('span');
            skillSpan.className = 'skill-tag';
            skillSpan.textContent = skill;
            container.appendChild(skillSpan);
        });
    } else {
        section.style.display = 'none';
    }
}

// Download resume as PDF
async function downloadResume() {
    try {
        const { jsPDF } = window.jspdf;
        const resumeElement = document.getElementById('resumePreview');
        
        // Show loading state
        const downloadBtn = document.querySelector('.download-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '⏳ Generating...';
        downloadBtn.disabled = true;
        
        // Configure html2canvas options
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: resumeElement.scrollWidth,
            height: resumeElement.scrollHeight
        });
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions to fit A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Generate filename based on name
        const name = document.getElementById('fullName')?.value || 'Resume';
        const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        
        // Reset button on error
        const downloadBtn = document.querySelector('.download-btn');
        downloadBtn.innerHTML = '📥 Download PDF';
        downloadBtn.disabled = false;
    }
}

// Save resume data to localStorage
function saveResumeData() {
    const resumeData = {
        personal: {
            fullName: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || '',
            summary: document.getElementById('summary')?.value || ''
        },
        experience: [],
        education: [],
        skills: skills,
        color: currentColor
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
            institution: document.getElementById(`edu-institution-${i}`)?.value || '',
            year: document.getElementById(`edu-year-${i}`)?.value || '',
            gpa: document.getElementById(`edu-gpa-${i}`)?.value || ''
        };
        if (edu.degree || edu.institution || edu.year) {
            resumeData.education.push(edu);
        }
    }
    
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Load resume data from localStorage
function loadResumeData() {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        const resumeData = JSON.parse(saved);
        
        // Load personal data
        if (resumeData.personal) {
            document.getElementById('fullName').value = resumeData.personal.fullName || '';
            document.getElementById('email').value = resumeData.personal.email || '';
            document.getElementById('phone').value = resumeData.personal.phone || '';
            document.getElementById('address').value = resumeData.personal.address || '';
            document.getElementById('summary').value = resumeData.personal.summary || '';
        }
        
        // Load skills
        skills = resumeData.skills || [];
        updateSkillsList();
        
        // Load color
        if (resumeData.color) {
            changeColor(resumeData.color);
        }
        
        updatePreview();
    }
}

// Auto-save functionality
function enableAutoSave() {
    setInterval(saveResumeData, 30000); // Save every 30 seconds
}

// Event listeners
window.addEventListener('load', function() {
    handleScrollAnimations();
    initSmoothScroll();
    loadResumeData();
    enableAutoSave();
});

window.addEventListener('scroll', handleScrollAnimations);

// Handle form input changes for auto-save
document.addEventListener('input', function(e) {
    if (e.target.matches('input, textarea')) {
        // Debounce save
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(saveResumeData, 2000);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveResumeData();
        
        // Show save confirmation
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `;
        notification.textContent = 'Resume saved!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    // Ctrl+P or Cmd+P to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        downloadResume();
    }
});

// Initialize animations on page load
handleScrollAnimations();