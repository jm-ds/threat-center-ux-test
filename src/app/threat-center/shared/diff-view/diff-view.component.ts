import { Component, OnInit } from '@angular/core';

export interface DiffContent {
  leftContent: string;
  rightContent: string;
}

export type DiffTableFormat = 'SideBySide' | 'LineByLine';

export interface DiffResults {
  hasDiff: boolean;
  diffsCount: number;
  rowsWithDiff: {
    leftLineNumber?: number;
    rightLineNumber?: number;
    numDiffs: number;
  }[];
}

@Component({
  selector: 'diff-view',
  templateUrl: './diff-view.component.html',
  styleUrls: ['./diff-view.component.scss']
})
export class DiffViewComponent implements OnInit {

  public leftContent =
    `package io.shiftleft.controller;

    import io.shiftleft.data.DataLoader;
    import io.shiftleft.model.Patient;
    import io.shiftleft.repository.PatientRepository;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;

    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;
    import org.springframework.web.bind.annotation.RestController;

    /**
     * Admin checks login
     */

    @RestController
    public class PatientController {

      private static Logger log = LoggerFactory.getLogger(PatientController.class);

      @Autowired
      private PatientRepository patientRepository;

      /**
       * Gets all customers.
       *
       * @return the customers
       */
      @RequestMapping(value = "/patients", method = RequestMethod.GET)
      public Iterable<Patient> getPatient() {
        Patient pat = patientRepository.findOne(1l);
        if (pat != null) {
          //log.info("First Patient is {}", pat.toString());
          log.info("First Patient is not NULL");
       }
        return patientRepository.findAll();
      }

    }
    `;

  public rightContent =
    `package io.shiftleft.controller;

    import io.shiftleft.data.DataLoader;
    import io.shiftleft.model.Patient;
    import io.shiftleft.repository.PatientRepository;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Autowired;

    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;
    import org.springframework.web.bind.annotation.RestController;

    /**
     * Admin checks login
     */

    @RestController
    public class PatientController {

      private static Logger log = LoggerFactory.getLogger(PatientController.class);

      @Autowired
      private PatientRepository patientRepository;

      /**
       * Gets all customers.
       *
       * @return the customers
       */
      @RequestMapping(value = "/patients", method = RequestMethod.GET)
      public Iterable<Patient> getPatient() {
        Patient pat = patientRepository.findOne(1l);
        if (pat != null) {
          //log.info("First Patient is {}", pat.toString());
          log.info("First Patient is not NULL");
       }
        return patientRepository.findAll();
      }

    }
    `;

  public diffContent =
    `@RestController
    public class PatientController {

      private static Logger log = LoggerFactory.getLogger(PatientController.class);

      @Autowired
      private PatientRepository patientRepository;

      /**
       * Gets all customers.
       *
       * @return the customers
       */
      @RequestMapping(value = "/patients", method = RequestMethod.GET)
      public Iterable<Patient> getPatient() {
        Patient pat = patientRepository.findOne(1l);
        if (pat != null) {
          //log.info("First Patient is {}", pat.toString());
          log.info("First Patient is not NULL");
       }
        return patientRepository.findAll();
      }
    `;


  public assetCols = [
        { field: 'name', header: 'Name'},
        { field: 'size', header: 'Size' },
        { field: 'licenses', header: 'License(s)' },
    ];

    public assetData = [
      {"assetId": "1v32g23t", "name": "biglignasdfsdfile.java", "size": 5550 , "pct_opensource":55,"status": "Ingored","licenses": [{"name":"GPL v3"},{"name":"Apache License 1.0"}]},
      {"assetId": "zc78ysdy", "name": "turkeyluirkey.j", "size": 3535 , "pct_opensource":5,"status": "Too Large","licenses": [{"name":"GPL v3"}]},
      {"assetId": "asd89v8y", "name": "umbitch.js", "size": 3623 , "pct_opensource":3.6,"status": "Too Small","licenses": [{"name":"GPL v3"}]},
      {"assetId": "asdv89as", "name": "filename.py", "size": 63523 , "pct_opensource":2.7,"status": "Analyzed","licenses": [{"name":"GPL v3"}]},
      {"assetId": "asdf898d", "name": "janga.cs", "size": 236768 , "pct_opensource":46.3,"status": "Analyzed","licenses": [{"name":"GPL v3"}]},
      {"assetId": "asdf8668", "name": "tobongo.java", "size": 56787 , "pct_opensource":17.4,"status": "File type not supported","licenses": [{"name":"GPL v3"}]},
    ];

  constructor() { }

  ngOnInit() {
  }

}
