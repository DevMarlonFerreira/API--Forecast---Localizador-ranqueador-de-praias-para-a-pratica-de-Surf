


SELECT Nome, Endereco FROM Cliente 

SELECT Numero_conta, Saldo, Tipo_Conta, Num_agencia FROM Conta WHERE Saldo > 500 AND Tipo_Conta = 'Conta Corrente'

SELECT Banco.Codigo, Banco.Nome, Agencia.Endereco, Cliente.Nome, SUM(Conta.Saldo) as saldo
FROM Banco 
INNER JOIN Agencia ON Agencia.Cod_banco = Agencia.Cod_Banco
INNER JOIN Conta ON Agencia.Numero_agencia = Conta.Num_agencia 
INNER JOIN Historico ON Conta.Numero_conta = Historico.Num_Conta 
INNER JOIN Cliente ON Historico.CPF_Cliente = Cliente.CPF
WHERE Historico.Data_Inicio > '2018-12-31' AND Historico.Data_Inicio < '2020-01-01'
GROUP BY Cliente.Nome