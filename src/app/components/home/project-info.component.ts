import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="info-container">
      <section class="welcome-section">
        <h2>Welcome to the revamped Flash Flash Revolution Perfect Project!</h2>
        <p>
          Thanks for stopping in! The FFR Perfect Project is a community project aimed at collecting videos of users AAA'ing every songs in FFR. 
          Anyone is able to participate, and we encourage everyone to get involved! Spread the word - the main FFR thread can be viewed 
          <a href="https://www.flashflashrevolution.com/vbz/showthread.php?t=115145" target="_blank">here</a>.
        </p>
        <p>
          To get started, read through the rules below and follow all the instructions needed to submit a video. 
          We can't wait to see what awesome AAA's you send in!
        </p>
        <p class="signature">Cheers,<br/>justin</p>
      </section>

      <section class="rules-section">
        <h2>Submitting to the FFR Perfect Project</h2>
        <p>So YOU'VE got what it takes to AAA songs in FFR, on camera?? Heck yeah!</p>
        <p>
          Submissions are sent to the 
          <a href="mailto:ffrperfectproject@gmail.com">FFRPP email</a>, 
          and must follow these rules:
        </p>
        
        <h3>Submission Rules</h3>
        <ol>
          <li>All speedmods are fine, but try to keep modifications limited to Mirror at most.</li>
          <li>Videos must be live recordings of keytaps, screen, and/or hands. Screen recordings only will not be accepted.</li>
          <li>Make sure quality is decent & that we can actually see the gameplay.</li>
          <li>Videos are uploaded on a first come first serve basis. In the interest of fairness we may upload multiple videos of one song.</li>
          <li>When sending videos, please name the title of your email/video file "Song (Username)", for song and user recognition.</li>
        </ol>

        <p>
          If there are any questions about the submission process, etc., don't hesitate to reach out! 
          You can contact our project coordinators via Discord:
        </p>
        <ul class="discord-contacts">
          <li>SubaruPoptart: hopecaster</li>
          <li>justin: xyr0</li>
        </ul>
        <p>
          Thanks again for your interest in this project - it's the community that brings this project to 
          fruition and your input and interest matters!
        </p>
        <p class="signature">Cheers,<br/>justin</p>
      </section>
    </div>
  `,
  styles: [`
    .info-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    section {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background-color 0.3s;
    }

    :host-context(body.dark-mode) section {
      background: #2d2d2d;
    }

    h2 {
      color: #28aad1;
      margin-bottom: 1.5rem;
    }

    h3 {
      color: #28aad1;
      margin: 1.5rem 0 1rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    a {
      color: #28aad1;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .signature {
      font-style: italic;
      margin-top: 2rem;
    }

    ol {
      margin: 1rem 0 1.5rem 2rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    .discord-contacts {
      list-style: none;
      margin: 1rem 0;
      padding-left: 1rem;
    }

    .discord-contacts li {
      font-family: monospace;
      padding: 0.25rem 0;
    }

    @media (max-width: 768px) {
      .info-container {
        padding: 1rem;
      }

      section {
        padding: 1.5rem;
      }
    }
  `]
})
export class ProjectInfoComponent {}