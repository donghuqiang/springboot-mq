package com.dhq.utils;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 自定义返回结果
 */
public class RestResult implements Serializable {

    /**
     * 返回码
     */
    private int code;

    /**
     * 返回结果描述
     */
    private String message;

    /**
     * 返回内容
     */
    private Object data;

    private int draw;
    private int start;
    private int length;
    private int recordsTotal;
    private int recordsFiltered;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }

    private RestResult(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private RestResult(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    private RestResult(ResultStatus status) {
        this.code = status.getCode();
        this.message = status.getMessage();
    }

    private RestResult(ResultStatus status, Object data) {
        this.code = status.getCode();
        this.message = status.getMessage();
        this.data = data;
    }

    private RestResult(ResultStatus status, Object data, int recordsTotal, int draw, int start, int length) {
        this.code = status.getCode();
        this.message = status.getMessage();
        this.data = data;
        this.recordsTotal = recordsTotal;
        this.draw = draw;
        this.start = start;
        this.length = length;
        this.recordsFiltered = recordsTotal;
    }

    public static RestResult ok() {
        return new RestResult(ResultStatus._200());
    }

    public static RestResult warperpageOk(Object data, int recordsTotal, int draw, int start, int length) {
        return new RestResult(ResultStatus._200(), data, recordsTotal, draw, start, length);
    }

    public static RestResult warperOk(Object data) {
        return new RestResult(ResultStatus._200(), data);
    }

    public static RestResult warperMsgOk(String message, Object data) {
        return new RestResult(ResultStatus._200().getCode(), message, data);
    }

    public static RestResult paramterError(BindingResult result) {
        List<FieldError> errors = result.getFieldErrors();
        Map error_map = new HashMap();
        for (FieldError e : errors) {
            error_map.put(e.getField().toString(), e.getDefaultMessage());
        }
        return new RestResult(ResultStatus._1000(), error_map);
    }


    public static RestResult error(String message) {
        return new RestResult(ResultStatus._500(), message);
    }

    public static RestResult error(int code, String message) {
        return new RestResult(code, message);
    }

    public void setData(Object data) {
        this.data = data;
    }


    public int getRecordsFiltered() {
        return recordsFiltered;
    }

    public void setRecordsFiltered(int recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

    public int getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(int recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getDraw() {
        return draw;
    }

    public void setDraw(int draw) {
        this.draw = draw;
    }
}
