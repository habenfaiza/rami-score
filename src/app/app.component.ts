import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rami-score';
  partySettings = this.fb.group({
    equipe1: new FormControl('', Validators.required),
    equipe2: new FormControl('', Validators.required),
    scoreMax: new FormControl(null, Validators.required)
  });

  scoringForm = this.fb.group({
      scoreT1: new FormControl(),
      scoreT2: new FormControl()
    }
  );

  scoreObject = signal([
    {
      order: 1,
      teamTitle: "Brika",
      teamScores: [0]
    },
    {
      order: 2,
      teamTitle: "Mourtaddet",
      teamScores: [0]
    }
  ]);
  isPartyOn = false;
  endOfGame = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.scoringForm.get('scoreT1')?.valueChanges.subscribe(val => {
      if (val && val > 0) {
        this.scoringForm.get('scoreT2')?.disable({emitEvent: false});
      } else {
        this.scoringForm.get('scoreT2')?.enable({emitEvent: false});
      }
    })

    this.scoringForm.get('scoreT2')?.valueChanges.subscribe(val => {
      if (val && val > 0) {
        this.scoringForm.get('scoreT1')?.disable({emitEvent: false});
      } else {
        this.scoringForm.get('scoreT1')?.enable({emitEvent: false});
      }
    })
  }

  pushNewScore() {
    const scoreT1 = this.scoringForm.get('scoreT1')?.value;
    const scoreT2 = this.scoringForm.get('scoreT2')?.value;
    if (scoreT1) {
      this.scoreObject.update(obj => {
        obj[0].teamScores.push(obj[0].teamScores[obj[0].teamScores.length - 1] + scoreT1);
        obj[1].teamScores.push(obj[1].teamScores[obj[1].teamScores.length - 1] - 10);
        return obj;
      });
    }
    if (scoreT2) {
      this.scoreObject.update(obj => {
        obj[1].teamScores.push(obj[1].teamScores[obj[1].teamScores.length - 1] + scoreT2);
        obj[0].teamScores.push(obj[0].teamScores[obj[0].teamScores.length - 1] - 10);
        return obj;
      });
    }
    this.scoringForm.reset();
    this.checkEndOfGame();
  }

  lakma(winnerTeamIndex: number, loserTeamIndex: number) {
    this.scoreObject()[loserTeamIndex].teamScores.push(this.scoreObject()[loserTeamIndex].teamScores[this.scoreObject()[loserTeamIndex].teamScores.length - 1] + 200);
    this.scoreObject()[winnerTeamIndex].teamScores.push(this.scoreObject()[winnerTeamIndex].teamScores[this.scoreObject()[winnerTeamIndex].teamScores.length - 1] - 10);
    this.checkEndOfGame();
  }

  tafricha() {
    this.scoreObject()[0].teamScores.push(0o0);
    this.scoreObject()[1].teamScores.push(0o0);
  }

  newGame() {
    this.scoreObject.update(obj => {
      obj[0].teamScores = [0];
      obj[1].teamScores = [0];
      return obj;
    });
    this.partySettings.reset();
    this.isPartyOn = false;
    this.endOfGame = false;
  }

  rollBack() {
    this.scoreObject.update(obj => {
      obj[0].teamScores.pop();
      obj[1].teamScores.pop();
      return obj;
    });
    this.checkEndOfGame();
  }

  startGame() {
    const equipe1 = this.partySettings.get('equipe1')?.value;
    const equipe2 = this.partySettings.get('equipe2')?.value;
    this.scoreObject.update(obj => {
      if (equipe1 != null) {
        obj[0].teamTitle = equipe1;
      }
      if (equipe2 != null) {
        obj[1].teamTitle = equipe2;
      }
      return obj;
    });
    this.isPartyOn = true;
  }

  checkEndOfGame() {
    const maxScore = this.partySettings.get('scoreMax')?.value;
    const lastT1Score = this.scoreObject()[0].teamScores[this.scoreObject()[0].teamScores.length - 1];
    const lastT2Score = this.scoreObject()[1].teamScores[this.scoreObject()[1].teamScores.length - 1];
    if (maxScore && (lastT1Score > maxScore || lastT2Score > maxScore)) {
      this.endOfGame = true;
    } else {
      this.endOfGame = false;
    }
  }
}
