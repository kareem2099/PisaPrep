// Load footer content
document.addEventListener('DOMContentLoaded', function() {
    // Load footer HTML
    fetch('/includes/footer.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('footer-container').innerHTML = html;
        // Update year after footer is loaded
        document.querySelector('.year').textContent = new Date().getFullYear();
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  
    // Footer functionality
    function initFooter() {
      // Newsletter form submission
      const newsletterForms = document.querySelectorAll('.newsletter-form');
      newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const email = this.querySelector('input[type="email"]').value;
          // Here you would typically send the email to your server
          console.log('Subscribed email:', email);
          alert('شكراً على اشتراكك في نشرتنا البريدية!');
          this.reset();
        });
      });
  
      // App download button click
      const downloadButtons = document.querySelectorAll('.download-btn');
      downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Track download button click
          console.log('Download button clicked');
          // In a real app, this would redirect to app store
        });
      });
    }
  
    // Initialize footer functionality
    setTimeout(initFooter, 100); // Small delay to ensure footer is loaded
  });