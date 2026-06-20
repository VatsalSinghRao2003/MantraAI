package com.mantra.mantra_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompareResponse {

    private Integer score1;
    private Integer score2;
    private String winner;
}
